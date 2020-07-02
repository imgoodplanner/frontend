import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, Trans } from 'react-i18next';
// import { Link } from 'react-router-dom';

import routes from 'routes';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import makeStyles from '@material-ui/core/styles/makeStyles';

// import MUILink from '@material-ui/core/Link';
// import Typography from '@material-ui/core/Typography';
// import Box from '@material-ui/core/Box';
import CardAuth from 'components/dumb/Card/Auth';
import CardHeaderAuthSignUp from 'components/smart/Card/Auth/Header/SignUp';
import ButtonGoBackTo from 'components/dumb/Button/GoBack/To';
import FormFields from '@misakey/ui/Form/Fields';
import FieldTextPasswordRevealable from 'components/dumb/Form/Field/Text/Password/Revealable';

// CONSTANTS
const FIELD = 'password';

const DEFAULT_FIELDS = {
  [FIELD]: { component: FieldTextPasswordRevealable, inputProps: { 'data-matomo-ignore': true }, autoFocus: true, placeholder: 'Martin.Lapin.Cochon.Taratata.' },
  passwordConfirm: { component: FieldTextPasswordRevealable, inputProps: { 'data-matomo-ignore': true } },
};

// HOOKS
const useStyles = makeStyles((theme) => ({
  cardRoot: {
    maxWidth: 500,
    [theme.breakpoints.up('sm')]: {
      minWidth: 500,
    },
  },
}));

// COMPONENTS
const AuthSignUpCreatePasswordFormFields = (fields) => (
  <FormFields fields={fields} prefix="signUp." defaultFields={DEFAULT_FIELDS} />
);

AuthSignUpCreatePasswordFormFields.defaultProps = DEFAULT_FIELDS;

const AuthSignUpCreatePassword = ({
  t,
  setTouched,
  location: { search },
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const padded = useMediaQuery(theme.breakpoints.up('sm'));

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

  const primary = useMemo(
    () => ({
      type: 'submit',
      text: t('common:next'),
    }),
    [t],
  );

  const parentTo = useMemo(
    () => ({
      pathname: routes.auth.signUp.notifications,
      search,
    }),
    [search],
  );

  useEffect(
    () => {
      setTouched({ tos: true, email: true, handle: true, notifications: true });
    },
    [setTouched],
  );

  return (
    <CardAuth
      className={classes.cardRoot}
      padded={padded}
      primary={primary}
      secondary={<ButtonGoBackTo to={parentTo} />}
      title={t('auth:signUp.create.password.title')}
      titleProps={titleProps}
      subtitle={(
        <Trans
          i18nKey="auth:signUp.create.password.subtitle"
        >
          Je choisis un mot de passe fort pour protéger la clé secrète de mon coffre-fort.
          <strong>Une longue succession de mots simples aléatoires</strong>
          vaut mieux que des caractères complexes (%£&!)
        </Trans>
      )}
      subtitleProps={subtitleProps}
      Header={CardHeaderAuthSignUp}
      formik
    >
      <AuthSignUpCreatePasswordFormFields />
      {/* <Box mt={2}>
        <Typography>
          {t('auth:signUp.create.password.more.text')}
          <MUILink
            color="secondary"
            to={routes.legals.privacy}
            component={Link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('auth:signUp.create.password.more.link')}
          </MUILink>
        </Typography>
      </Box> */}
    </CardAuth>
  );
};

AuthSignUpCreatePassword.propTypes = {
  // ROUTER
  location: PropTypes.shape({ search: PropTypes.string }).isRequired,
  // FORMIK
  setTouched: PropTypes.func.isRequired,
  // withTranslation
  t: PropTypes.func.isRequired,
};


export default withTranslation(['auth', 'common'])(AuthSignUpCreatePassword);