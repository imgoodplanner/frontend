const routes = {
  _: '/',
  account: {
    _: '/account',
    profile: {
      avatar: {
        _: '/account/profile/avatar',
        upload: '/account/profile/avatar/upload',
      },
      name: '/account/profile/name',
      password: '/account/profile/password',
    },
    mailProvider: { _: '/account/mail-provider' },
    thirdParty: { setup: '/account/third-party/setup' },
  },
  admin: {
    _: '/admin',
    services: '/admin/services',
    service: {
      _: '/admin/:mainDomain',
      home: { _: '/admin/:mainDomain' },
      create: {
        _: '/admin/service/create',
        mainDomain: '/admin/service/create/:mainDomain',
      },
      list: { _: '/admin/service/list' },
      claim: { _: '/admin/:mainDomain/claim' },
      information: {
        _: '/admin/:mainDomain/information',
        name: '/admin/:mainDomain/information/name',
        logo: {
          _: '/admin/:mainDomain/information/logo',
          upload: '/admin/:mainDomain/information/logo/upload',
        },
        mainDomain: '/admin/:mainDomain/information/mainDomain',
        otherDomains: '/admin/:mainDomain/information/otherDomains',
        shortDesc: '/admin/:mainDomain/information/shortDesc',
        longDesc: '/admin/:mainDomain/information/longDesc',
      },
      sso: {
        _: '/admin/:mainDomain/sso',
        allowedOrigins: '/admin/:mainDomain/sso/allowedOrigins',
        redirectUri: '/admin/:mainDomain/sso/redirectUri',
        productionSetup: '/admin/:mainDomain/sso/productionSetup',
        customRoles: '/admin/:mainDomain/sso/customRoles',
      },
      users: {
        _: '/admin/:mainDomain/users',
        edit: '/admin/:mainDomain/users/edit',
      },
      data: { _: '/admin/:mainDomain/data' },
    },
  },
  auth: {
    _: '/auth',
    callback: '/callback',
    error: '/auth/error',
    recover: '/auth/recover',
    redirectToSignIn: '/login',
    signOut: '/logout',
    signIn: {
      _: '/auth/login',
      secret: '/auth/login/secret',
    },
    signUp: {
      _: '/auth/register',
      preamble: '/auth/register/preamble',
      identifier: '/auth/register/identifier',
      handle: '/auth/register/handle',
      password: '/auth/register/password',
      confirm: '/auth/register/confirm',
      finale: '/auth/register/finale',
    },
    forgotPassword: '/auth/password/forgot',
  },
  citizen: {
    _: '/citizen',
    contact: {
      _: '/citizen/contact',
    },
    applications: {
      _: '/citizen/applications',
      categories: '/citizen/applications/categories',
      category: '/citizen/applications/:category',
      create: '/citizen/applications/create',
    },
    application: {
      _: '/citizen/:mainDomain',
      contact: {
        _: '/citizen/:mainDomain/contact',
        preview: '/citizen/:mainDomain/contact/preview',
        providers: '/citizen/:mainDomain/contact/providers',
      },

      vault: '/citizen/:mainDomain/vault',
      feedback: '/citizen/:mainDomain/feedback',
      legal: '/citizen/:mainDomain/legal',
      more: '/citizen/:mainDomain/more',

      myFeedback: '/citizen/:mainDomain/feedback/me',
    },
  },
  dpo: {
    _: '/dpo',
    services: {
      _: '/dpo/services',
      create: '/dpo/services/create',
    },
    service: {
      _: '/dpo/:mainDomain',
      claim: { _: '/dpo/:mainDomain/claim' },
      requests: {
        _: '/dpo/:mainDomain/requests',
        read: '/dpo/:mainDomain/requests/:databoxId',
      },
    },
  },
  legals: {
    privacy: '/legals/privacy',
    tos: '/legals/tos',
  },
  requests: '/requests',
  plugin: {
    _: '/index.html',
    blank: '/plugin-blank',
  },
  errors: {
    forbidden: '/errors/forbidden',
  },
};

export default routes;
