import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import omitTranslationProps from '@misakey/helpers/omit/translationProps';

import makeStyles from '@material-ui/core/styles/makeStyles';

import withDialogConnect from 'components/smart/Dialog/Connect/with';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

// CONSTANTS
export const FAB_WIDTH = 56;
export const FAB_BOTTOM = 4;
export const FAB_RIGHT = 4;

// HOOKS
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(FAB_BOTTOM),
    right: theme.spacing(FAB_RIGHT),
    zIndex: 1,
  },
}));

// COMPONENTS
const AuthRequiredFab = withDialogConnect(Fab);

const SearchApplicationsFab = ({ t, ...props }) => {
  const classes = useStyles();

  return (
    <Tooltip title={t('citizen:requests.create')}>
      <AuthRequiredFab
        className={classes.root}
        color="secondary"
        aria-label={t('citizen:requests.create')}
        {...omitTranslationProps(props)}
      >
        <AddIcon />
      </AuthRequiredFab>
    </Tooltip>

  );
};

SearchApplicationsFab.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation('citizen')(SearchApplicationsFab);