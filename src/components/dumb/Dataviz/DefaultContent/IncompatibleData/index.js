import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation, Trans } from 'react-i18next';

import { makeStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

// HOOKS
const useStyles = makeStyles((theme) => ({
  box: ({ mainColor }) => ({
    background: mainColor,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    borderRadius: theme.spacing(2),
  }),
}));

const FEEDBACK_EMAIL = 'feedback@misakey.com';

const IncompatibleData = ({ application }) => {
  const { mainColor } = application;

  const classes = useStyles({ mainColor });

  return (
    <Box className={classes.box}>
      <Trans i18nKey="citizen:dataviz.incompatibleData" values={{ contactEmail: FEEDBACK_EMAIL }}>
        <Typography align="center" variant="h3" paragraph>
          Oups,
        </Typography>
        <Typography align="center" variant="h5" paragraph>
          Votre fichier de portabilité semble avoir un format nouveau.
        </Typography>
        <Typography align="center" variant="body1">
          Prévenez nous par e-mail afin qu’on le prenne en compte&nbsp;:
          <Link href={`mailto:${FEEDBACK_EMAIL}`} color="inherit">{'{{contactEmail}}'}</Link>
        </Typography>
      </Trans>
    </Box>
  );
};

IncompatibleData.propTypes = {
  application: PropTypes.shape({
    mainColor: PropTypes.string,
  }).isRequired,
};

export default withTranslation(['citizen'])(IncompatibleData);