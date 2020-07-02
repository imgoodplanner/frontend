import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import routes from 'routes';

import isEmpty from '@misakey/helpers/isEmpty';
import isNil from '@misakey/helpers/isNil';
import prop from '@misakey/helpers/prop';
import objectToCamelCase from '@misakey/helpers/objectToCamelCase';
import redirect from '@misakey/helpers/redirect';

import useHandleHttpErrors from '@misakey/hooks/useHandleHttpErrors';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { fetchPwdHashParams } from '@misakey/auth/builder/accounts';
import initAuth from '@misakey/auth/builder/initAuth';
import loginAuthStep from '@misakey/auth/builder/loginAuthStep';

// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import MUILink from '@material-ui/core/Link';
import CardAuth from 'components/dumb/Card/Auth';
import CardHeaderAuthSignUp from 'components/smart/Card/Auth/Header/SignUp';
import { DEFAULT_SECLEVEL } from 'constants/auth';

// CONSTANTS
const PARENT_TO = routes.auth.signIn._;
const EMPTY_SECRET_TO = routes.auth.signIn.secret;

// HELPERS
const displayNameProp = prop('displayName');

// HOOKS
const useStyles = makeStyles((theme) => ({
  cardRoot: {
    maxWidth: 500,
    [theme.breakpoints.up('sm')]: {
      minWidth: 500,
    },
  },
  contentTitleTypography: {
    fontWeight: 'bold',
  },
  contentTextTypography: {
    whiteSpace: 'pre-wrap',
  },
}));

// COMPONENTS
const AuthSignUpFinale = ({
  email,
  password,
  acr,
  challenge,
  publics,
  t,
  history,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const padded = useMediaQuery(theme.breakpoints.up('sm'));

  const handleHttpErrors = useHandleHttpErrors();

  const [isLoading, setLoading] = useState(false);

  const displayName = useMemo(
    () => displayNameProp(publics),
    [publics],
  );

  const titleProps = useMemo(
    () => ({
      align: 'center',
      gutterBottom: true,
    }),
    [],
  );

  const subtitleProps = useMemo(
    () => ({
      align: 'center',
    }),
    [],
  );

  const onClick = useCallback(
    async () => {
      if (isEmpty(password)) {
        history.push(EMPTY_SECRET_TO);
        return;
      }

      setLoading(true);

      try {
        const pwdHashParams = await fetchPwdHashParams({ email });
        await initAuth({
          challenge,
          email,
          acr: (acr || DEFAULT_SECLEVEL),
          serverRelief: true,
        });
        const signInResponse = await loginAuthStep({
          challenge,
          email,
          secret: password,
          acr: (acr || DEFAULT_SECLEVEL),
          pwdHashParams,
        });

        const { redirectTo } = objectToCamelCase(signInResponse);
        if (!isNil(redirectTo)) {
          redirect(redirectTo);
        }
      } catch (error) {
        handleHttpErrors(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [challenge, email, handleHttpErrors, history, password, acr],
  );

  const primary = useMemo(
    () => ({
      onClick,
      isLoading,
      text: t('common:gotIt'),
    }),
    [isLoading, onClick, t],
  );

  if (isNil(email) || isNil(displayName)) {
    return <Redirect to={PARENT_TO} />;
  }

  return (
    <CardAuth
      className={classes.cardRoot}
      padded={padded}
      primary={primary}
      title={t('auth:signUp.finale.title', { displayName })}
      titleProps={titleProps}
      subtitle={t('auth:signUp.finale.subtitle')}
      subtitleProps={subtitleProps}
      Header={CardHeaderAuthSignUp}
    >
      <Typography className={classes.contentTitleTypography} variant="body2">{t('auth:signUp.finale.content.title')}</Typography>
      <Typography className={classes.contentTextTypography} variant="body2">{t('auth:signUp.finale.content.text')}</Typography>

      {/* <Box mt={2}>
        <Typography>
          {t('auth:signUp.finale.more.text')}
          <MUILink
            color="secondary"
            to={routes.legals.privacy}
            component={Link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('auth:signUp.finale.more.link')}
          </MUILink>
        </Typography>
      </Box> */}
    </CardAuth>
  );
};

AuthSignUpFinale.propTypes = {
  // ROUTER
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  // withTranslation
  t: PropTypes.func.isRequired,
  // CONNECT
  email: PropTypes.string,
  password: PropTypes.string,
  challenge: PropTypes.string,
  publics: PropTypes.shape({
    displayName: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
  acr: PropTypes.number.isRequired,
};

AuthSignUpFinale.defaultProps = {
  email: '',
  password: '',
  challenge: '',
  publics: null,
};


// CONNECT
const mapStateToProps = (state) => ({
  email: state.screens.auth.identifier,
  password: state.screens.auth.secret,
  challenge: state.sso.loginChallenge,
  publics: state.screens.auth.publics,
  acr: state.sso.acr,
});

export default connect(mapStateToProps, {})(withTranslation(['auth', 'common'])(AuthSignUpFinale));