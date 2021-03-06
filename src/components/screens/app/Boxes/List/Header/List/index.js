import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import STATUSES from 'constants/app/boxes/statuses';
import { SIDES } from '@misakey/ui/constants/drawers';

import omitTranslationProps from '@misakey/helpers/omit/translationProps';

import Box from '@material-ui/core/Box';

import { DRAWER_PROPS_PROP_TYPES } from 'components/smart/Screen/Drawer';
import AppBarDrawer from 'components/dumb/AppBar/Drawer';
import IconButtonAppBar from 'components/dumb/IconButton/Appbar';
import OpenDrawerAccountButton from 'components/smart/Button/Drawer/Account';
import withDialogCreate from 'components/smart/Dialog/Boxes/Create/with';
import withDialogPassword from 'components/smart/Dialog/Password/with';

import AddIcon from '@material-ui/icons/Add';

// COMPONENTS
const IconButtonCreate = withDialogCreate(
  withDialogPassword(IconButtonAppBar),
);

function ListHeader({ drawerWidth, activeStatus, t, ...props }) {
  return (
    <AppBarDrawer side={SIDES.LEFT} {...omitTranslationProps(props)}>
      <OpenDrawerAccountButton />
      <Box display="flex" flexGrow={1} />
      <IconButtonCreate
        aria-label={t('boxes:list.empty.create')}
        edge="end"
        color="secondary"
      >
        <AddIcon />
      </IconButtonCreate>
    </AppBarDrawer>
  );
}

ListHeader.propTypes = {
  activeStatus: PropTypes.oneOf(STATUSES).isRequired,
  // DRAWER
  drawerWidth: DRAWER_PROPS_PROP_TYPES.drawerWidth.isRequired,
  isDrawerOpen: DRAWER_PROPS_PROP_TYPES.isDrawerOpen.isRequired,
  // withTranslation
  t: PropTypes.func.isRequired,
};

export default withTranslation(['common', 'boxes'])(ListHeader);
