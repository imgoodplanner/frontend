import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from 'routes';
import PropTypes from 'prop-types';

import RouteAcr from '@misakey/auth/components/Route/Acr';
import Boxes from 'components/screens/app/Boxes';
import Accounts from 'components/screens/app/Account';
import AccountDrawer from 'components/smart/Drawer/Account';
import useLoadSecretsFromShares from '@misakey/crypto/hooks/useLoadSecretsFromShares';
import withIdentity from 'components/smart/withIdentity';
import SplashScreen from '@misakey/ui/Screen/Splash/WithTranslation';
import VaultDocuments from '../Documents';

function Home({ isFetchingIdentity }) {
  const { isLoadingBackupKey, isReady } = useLoadSecretsFromShares();

  if (isFetchingIdentity || isLoadingBackupKey) {
    return <SplashScreen />;
  }

  return (
    <>
      <AccountDrawer />
      <Switch>
        <RouteAcr
          acr={2}
          path={routes.accounts._}
          component={Accounts}
        />
        <RouteAcr
          acr={2}
          path={routes.documents._}
          component={VaultDocuments}
        />
        <Route
          path={routes.boxes._}
          render={(routeProps) => <Boxes isReady={isReady} {...routeProps} />}
        />
      </Switch>
    </>
  );
}


Home.propTypes = {
  isFetchingIdentity: PropTypes.bool,
};

Home.defaultProps = {
  isFetchingIdentity: false,
};

export default withIdentity(Home);
