import PropTypes from 'prop-types';

import { METHODS } from '@misakey/auth/constants/method';
import { PROP_TYPES as PWD_HASH_PROP_TYPES } from '@misakey/auth/passwordHashing/constants';
import isNil from '@misakey/helpers/isNil';
import prop from '@misakey/helpers/prop';
import { parseAcrValues, parseAcr } from '@misakey/helpers/parseAcr';
import createResetOnSignOutReducer from '@misakey/auth/store/reducers/helpers/createResetOnSignOutReducer';
import { createSelector } from 'reselect';

import { SSO_RESET, SSO_UPDATE, SSO_SIGN, SSO_UNSIGN } from '@misakey/auth/store/actions/sso';

// CONSTANTS
export const PROP_TYPES = {
  client: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    logoUri: PropTypes.string,
    tosUri: PropTypes.string,
    policyUri: PropTypes.string,
  }),
  // not an identity schema because we didn't pass auth flow yet
  identity: PropTypes.shape({
    displayName: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
  authnStep: PropTypes.shape({
    identityId: PropTypes.string,
    methodName: PropTypes.oneOf(METHODS),
    metadata: PropTypes.shape(PWD_HASH_PROP_TYPES),
  }),
  loginChallenge: PropTypes.string,
  loginHint: PropTypes.string,
  scope: PropTypes.arrayOf(PropTypes.string),
  acr: PropTypes.number,
  acrValues: PropTypes.arrayOf(PropTypes.string),
  accessToken: PropTypes.string,
};

// INITIAL STATE
export const INITIAL_STATE = {
  client: {},
  identity: {},
  authnStep: {},
  loginChallenge: null,
  loginHint: null,
  scope: [],
  acr: null,
  acrValues: [],
  accessToken: null,
};

const getState = prop('sso');

export const selectors = {
  getAuthnStep: createSelector(
    getState,
    prop('authnStep'),
  ),
};

// ACTION HANDLERS
function onReset() {
  return INITIAL_STATE;
}

function onUpdate(state, { sso: { acrValues, acr, ...rest } }) {
  let nextAcr = parseAcr(acr);

  if (isNil(nextAcr)) {
    nextAcr = parseAcrValues(acrValues);
  }

  return {
    ...state,
    ...rest,
    acr: nextAcr,
    acrValues,
  };
}

const onSign = (state, { accessToken }) => ({ ...state, accessToken });

const onUnSign = (state) => ({ ...state, accessToken: INITIAL_STATE.accessToken });

// REDUCER
export default createResetOnSignOutReducer(INITIAL_STATE, {
  [SSO_RESET]: onReset,
  [SSO_UPDATE]: onUpdate,
  [SSO_SIGN]: onSign,
  [SSO_UNSIGN]: onUnSign,
});
