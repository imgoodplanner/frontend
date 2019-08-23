// routes.example._ stands for routes.example.exact

const routes = {
  _: '/',
  auth: {
    _: '/auth',
    callback: '/callback',
    signOut: '/logout',
  },
  service: {
    _: '/:mainDomain',
    create: {
      _: '/service/create',
      mainDomain: '/service/create/:mainDomain',
    },
    list: '/service/list',
    claim: {
      _: '/:mainDomain/claim',
    },
    home: {
      _: '/:mainDomain',
    },
    information: {
      _: '/:mainDomain/information',
      edit: '/:mainDomain/information/edit',
    },
    sso: {
      _: '/:mainDomain/sso',
      edit: '/:mainDomain/sso/edit',
    },
    users: {
      _: '/:mainDomain/users',
      edit: '/:mainDomain/users/edit',
    },
    data: {
      _: '/:mainDomain/data',
    },
    requests: {
      _: '/:mainDomain/requests',
    },
  },
};

export default routes;
