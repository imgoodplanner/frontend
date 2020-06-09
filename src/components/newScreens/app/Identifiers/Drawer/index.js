import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Link, generatePath } from 'react-router-dom';
import routes from 'routes';

import Button from '@misakey/ui/Button';
import ButtonSignOut from '@misakey/auth/components/Button/SignOut';
import CardProfileThumbnail from 'components/dumb/Card/Profile/Thumbnail';
import AppBarDrawer, { SIDES } from 'components/dumb/AppBar/Drawer';
import IconButtonAppBar from 'components/dumb/IconButton/Appbar';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

// COMPONENTS
function IdentifierList({ drawerWidth, getNextDrawerSearch }) {
  const goBack = useMemo(
    () => getNextDrawerSearch(undefined, true),
    [getNextDrawerSearch],
  );
  const handleAccountRoute = useMemo(
    () => generatePath(routes.accounts.read._, { id: 'misakey' }),
    [],
  );
  return (
    <>
      <AppBarDrawer side={SIDES.LEFT} drawerWidth={drawerWidth}>
        <IconButtonAppBar
          color="inherit"
          aria-label="open drawer"
          edge="start"
          component={Link}
          to={goBack}
        >
          <ArrowBack />
        </IconButtonAppBar>
        <Typography variant="h6" noWrap>
          Mes identifiants !
        </Typography>
      </AppBarDrawer>
      <CardProfileThumbnail />
      <Box p={2}>
        <Typography>Listes des identifiants</Typography>
        <Button
          component={Link}
          to={handleAccountRoute}
          text="Voir tout"
        />
        <Button
          text="Se connecter avec l'identifiant 1"
          // eslint-disable-next-line no-console
          onClick={() => { console.log('WIP!'); }}
        />
      </Box>
      <Divider />
      <Box mx={4} my={2}>
        <ButtonSignOut />
      </Box>
      <Divider />
    </>
  );
}

IdentifierList.propTypes = {
  // DRAWER
  drawerWidth: PropTypes.string.isRequired,
  getNextDrawerSearch: PropTypes.func.isRequired,
};

export default IdentifierList;