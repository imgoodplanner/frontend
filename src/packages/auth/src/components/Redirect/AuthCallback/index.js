import React, { useMemo, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import isFunction from '@misakey/helpers/isFunction';
import isNil from '@misakey/helpers/isNil';

import useAuthFlowParams from '@misakey/auth/hooks/useAuthFlowParams';
import { getUrlForOidcCallback } from '../../../helpers';

import { withUserManager } from '../../OidcProvider';

// COMPONENTS
const RedirectAuthCallback = ({
  handleSuccess,
  handleError,
  location,
  fallbackReferrers,
  userManager,
  askSigninRedirect,
}) => {
  const [redirect, setRedirect] = useState(false);

  const {
    searchParams,
    storageParams: { referrer, scope, acrValues },
  } = useAuthFlowParams();

  const checkAcrIntegrity = useCallback(
    // No specific acr was specified or if specified acr match received acr
    (acr) => isNil(acrValues) || (acr.toString() === acrValues.toString()),
    [acrValues],
  );

  const processRedirectCallback = useCallback(
    async () => {
      try {
        const callbackUrl = getUrlForOidcCallback(window.location.href);
        const { csrfToken } = searchParams;
        const user = await userManager.signinRedirectCallback(callbackUrl);
        if (checkAcrIntegrity(user.profile.acr)) {
          if (isFunction(handleSuccess)) { handleSuccess({ ...user, csrfToken }); }
          return true;
        }
        const { email } = user.profile;
        const loginHint = email ? JSON.stringify({ identifier: email }) : '';
        askSigninRedirect({ scope, referrer, acrValues, prompt: 'login', loginHint }, false);
        return false;
      } catch (e) {
        if (isFunction(handleError)) { handleError(e); }
        return true;
      }
    },
    [searchParams, userManager, checkAcrIntegrity, askSigninRedirect,
      scope, referrer, acrValues, handleSuccess, handleError],
  );

  const fallbackReferrer = useMemo(
    () => (searchParams.csrfToken ? fallbackReferrers.success : fallbackReferrers.error),
    [searchParams, fallbackReferrers],
  );

  const processCallback = useCallback(() => {
    if (searchParams.csrfToken && searchParams.state) {
      processRedirectCallback()
        .then((shouldRedirect) => {
          setRedirect(shouldRedirect);
        });
    } else if (searchParams.error || searchParams.errorCode) {
      if (isFunction(handleError)) {
        handleError(searchParams);
      }
      setRedirect(true);
    }
  }, [searchParams, handleError, processRedirectCallback]);

  useEffect(processCallback, []);

  useEffect(() => {
    // Firefox BUGFIX: https://bugzilla.mozilla.org/show_bug.cgi?id=1422334#c15
    // Fixed in firefox 70 accodring to https://hg.mozilla.org/mozilla-central/rev/d14199c9c1cc
    // eslint-disable-next-line no-self-assign,no-param-reassign
    location.hash = location.hash;
    // eslint-disable-next-line no-self-assign
    window.location.hash = window.location.hash;
  }, [location.hash]);

  return redirect ? <Redirect to={referrer || fallbackReferrer} /> : null;
};

RedirectAuthCallback.propTypes = {
  fallbackReferrers: PropTypes.shape({
    error: PropTypes.string,
    success: PropTypes.string,
  }),
  handleError: PropTypes.func,
  handleSuccess: PropTypes.func,
  location: PropTypes.shape({ hash: PropTypes.string, search: PropTypes.string }).isRequired,
  // withUserManager
  userManager: PropTypes.object.isRequired,
  askSigninRedirect: PropTypes.func.isRequired,
};

RedirectAuthCallback.defaultProps = {
  fallbackReferrers: {},
  handleSuccess: null,
  handleError: null,
};

export default withUserManager(RedirectAuthCallback);
