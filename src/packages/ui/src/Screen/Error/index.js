import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Trans, withTranslation } from 'react-i18next';

import makeStyles from '@material-ui/core/styles/makeStyles';

import omitTranslationProps from '@misakey/helpers/omit/translationProps';
import isNil from '@misakey/helpers/isNil';

import BoxControls from '@misakey/ui/Box/Controls';
import IconButton from '@material-ui/core/IconButton';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Title from '@misakey/ui/Typography/Title';

import Box from '@material-ui/core/Box';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import ArrowBack from '@material-ui/icons/ArrowBack';

import Subtitle from '@misakey/ui/Typography/Subtitle';
import FooterFullScreen from '@misakey/ui/Footer/FullScreen';

// HOOKS
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
  },
}));

function ScreenError({ t, className,
  feedback, goBack,
  children,
  hideDefaultError, hideRefreshAction,
  ...rest
}) {
  const classes = useStyles();
  return (
    <Box
      className={classes.root}
      display="flex"
      flexDirection="column"
      height="100%"
    >
      <AppBar elevation={0} position="static" color="transparent">
        {!isNil(goBack) && (
          <Toolbar>
            <IconButton
              aria-label={t('common:goBack')}
              edge="start"
              component={Link}
              to={goBack}
            >
              <ArrowBack />
            </IconButton>
            <Typography color="textSecondary">{t('components:ScreenError.button.goback')}</Typography>
          </Toolbar>
        )}
      </AppBar>
      <Box height="100%">
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          m={3}
          height="inherit"
          className={className}
          {...omitTranslationProps(rest)}
        >
          {!hideDefaultError && (
            <>
              <Trans i18nKey="components:ScreenError.title">
                <Title align="center" color="secondary">
                  Oups ...
                </Title>
                <Title align="center">
                  Une erreur s&apos;est produite lors de la navigation
                </Title>
              </Trans>
              {!isNil(feedback) && (
                <Subtitle align="center">
                  <Trans i18nKey="components:ScreenError.subtitle">
                    Vous pouvez essayer de rafraichir la page. Si l&apos;erreur persiste,
                    <MuiLink href={`mailto:${feedback}`} color="secondary">{' contactez-nous'}</MuiLink>
                    .
                  </Trans>
                </Subtitle>
              )}
            </>
          )}
          {children}
          {!hideRefreshAction && (
            <BoxControls
              m={2}
              primary={{
                onClick: () => { window.location.reload(); },
                text: t('components:ScreenError.button.refresh'),
              }}
            />
          )}
        </Box>
      </Box>
      <FooterFullScreen />
    </Box>
  );
}

ScreenError.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hideDefaultError: PropTypes.bool,
  hideRefreshAction: PropTypes.bool,
  t: PropTypes.func.isRequired,
  feedback: PropTypes.string,
  goBack: PropTypes.string,
};

ScreenError.defaultProps = {
  children: null,
  className: '',
  hideDefaultError: false,
  hideRefreshAction: false,
  feedback: null,
  goBack: null,
};


export default withTranslation('components')(ScreenError);
