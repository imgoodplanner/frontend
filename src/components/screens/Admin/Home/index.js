import React from 'react';
import Redirect from '@misakey/ui/Redirect';
import generatePath from '@misakey/helpers/generatePath';
import routes from 'routes';

function Home() {
  return <Redirect to={generatePath(routes.admin.service.home._, { mainDomain: 'service' })} />;
}

export default Home;