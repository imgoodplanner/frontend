import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import AppBarStatic from '@misakey/ui/AppBar/Static';
import IconButtonAppBar from 'components/dumb/IconButton/Appbar';
import CardIdentity from 'components/dumb/Card/Identity';
import AvatarCurrentUser from 'components/smart/Avatar/CurrentUser';
import BoxFlexFill from '@misakey/ui/Box/FlexFill';

import ArrowBack from '@material-ui/icons/ArrowBack';
import { useParams, Link } from 'react-router-dom';
import routes from 'routes';
import useUpdateDocHead from '@misakey/hooks/useUpdateDocHead';

const AccountHome = ({ isDrawerOpen, toggleDrawer, identityMetadata }) => {
  const { id } = useParams();
  const { t } = useTranslation('account');

  useUpdateDocHead(t('account:documentTitle'));

  return (
    <>
      <AppBarStatic>
        {!isDrawerOpen && (
        <IconButtonAppBar
          aria-label="open drawer"
          edge="start"
          component={Link}
          to={routes.boxes._}
        >
          <ArrowBack />
        </IconButtonAppBar>
        )}
        <BoxFlexFill />
        {!isDrawerOpen && (
        <IconButtonAppBar
          aria-label="open drawer"
          edge="start"
          onClick={toggleDrawer}
        >
          <AvatarCurrentUser />
        </IconButtonAppBar>
        )}
      </AppBarStatic>
      {id && (
        <CardIdentity {...identityMetadata} />
      )}
    </>
  );
};

AccountHome.propTypes = {
  // DRAWER
  toggleDrawer: PropTypes.func.isRequired,
  identityMetadata: PropTypes.object.isRequired,
  isDrawerOpen: PropTypes.bool,
};

AccountHome.defaultProps = {
  isDrawerOpen: false,
};

export default AccountHome;
