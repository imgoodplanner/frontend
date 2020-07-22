import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import isNil from '@misakey/helpers/isNil';
import merge from '@misakey/helpers/merge';
import ramdaPath from '@misakey/helpers/path';
import assocPath from '@misakey/helpers/assocPath';
import propOr from '@misakey/helpers/propOr';
import pick from '@misakey/helpers/pick';
import createResetOnSignOutReducer from '@misakey/auth/store/reducers/helpers/createResetOnSignOutReducer';
import { createSelector } from 'reselect';

import {
  CRYPTO_LOAD_SECRETS,
  CRYPTO_SET_BACKUP_KEY,
  CRYPTO_IMPORT_SECRET_KEYS,
  CRYPTO_INITIALIZE,
  CRYPTO_SET_BACKUP_VERSION,
  CRYPTO_ADD_BOX_SECRET_KEY,
  CRYPTO_SET_ENCRYPTED_BACKUP_DATA,
  CRYPTO_SET_BACKUP_KEY_SHARE,
  CRYPTO_SET_BOX_KEY_SHARE,
} from '../actions/concrete';


// HELPERS

const concatToPath = (values, destObject, path) => (
  assocPath(
    path,
    [
      ...ramdaPath(path, destObject),
      ...values,
    ],
    destObject,
  )
);


// INITIAL STATE
export const INITIAL_STATE = {
  backupKey: null,
  backupVersion: null,
  backupKeyShares: {},
  data: null,
  secrets: {
    // @FIXME rename "secretKey" to "userDecryptionKey"
    secretKey: null,
    boxKeyShares: {},
    boxDecryptionKeys: [],
    // "passive" encryption keys are keys that must not be used any more for encrypting data;
    // they are only kept for decrypting data that was encrypted for them in the past.
    // This is typically used when recovering old keys that were retired after being lost.
    passive: {
      secretKeys: [],
      boxDecryptionKeys: [],
    },
  },
};

// SELECTORS
const getState = (state) => state.crypto;

const isCryptoLoaded = createSelector(
  getState,
  (state) => !isNil(state.backupKey),
);

const getBackupKey = createSelector(
  getState,
  (state) => state.backupKey,
);

const makeGetBackupKeyShareForAccount = () => createSelector(
  (state) => getState(state).backupKeyShares,
  (_, accountId) => accountId,
  (items, accountId) => propOr(null, accountId)(items),
);

const areSecretsLoaded = createSelector(
  getState,
  (state) => !isNil(state.secrets.secretKey),
);

const currentBoxSecrets = createSelector(
  getState,
  (state) => state.secrets.boxDecryptionKeys || [],
);

const getEncryptedBackupData = createSelector(
  getState,
  (state) => ({ data: state.data, backupVersion: state.backupVersion }),
);

const makeGetBoxKeyShare = () => createSelector(
  (state) => getState(state).secrets.boxKeyShares,
  (_, boxId) => boxId,
  (items, boxId) => propOr(null, boxId)(items),
);

export const selectors = {
  getBackupKey,
  makeGetBackupKeyShareForAccount,
  isCryptoLoaded,
  areSecretsLoaded,
  currentBoxSecrets,
  getEncryptedBackupData,
  makeGetBoxKeyShare,
};


// ACTION HANDLERS

function setBackupKey(state, { backupKey }) {
  return {
    ...state,
    backupKey,
  };
}

function setBackupKeyShare(state, { backupKeyShare, accountId }) {
  return {
    ...state,
    backupKeyShares: {
      ...state.backupKeyShares,
      [accountId]: backupKeyShare,
    },
  };
}


function setEncryptedBackupData(state, { data, backupVersion }) {
  return {
    ...state,
    data,
    backupVersion,
  };
}


function setEncryptedBackupVersion(state, { version }) {
  return {
    ...state,
    backupVersion: version,
  };
}


function initialize(state, { backupKey, secretKey }) {
  return {
    ...state,
    secrets: {
      ...state.secrets,
      secretKey,
    },
    backupKey,
  };
}

function loadSecrets(state, action) {
  return merge(
    { ...state },
    pick(['secrets', 'backupKey', 'backupVersion'], action),
  );
}


function addBoxSecretKey(state, { secretKey }) {
  return {
    ...state,
    secrets: {
      ...state.secrets,
      boxDecryptionKeys: [
        ...state.secrets.boxDecryptionKeys,
        secretKey,
      ],
    },
  };
}


function importSecretKeys(state, { secretKeys }) {
  return concatToPath(secretKeys, state, ['secrets', 'passive', 'secretKeys']);
}

function setBoxKeyShare(state, { boxId, keyShare }) {
  return {
    ...state,
    secrets: {
      ...state.secrets,
      boxKeyShares: {
        ...state.secrets.boxKeyShares,
        [boxId]: keyShare,
      },
    },
  };
}

// REDUCER
const cryptoReducer = createResetOnSignOutReducer(INITIAL_STATE, {
  [CRYPTO_SET_BACKUP_KEY]: setBackupKey,
  [CRYPTO_SET_ENCRYPTED_BACKUP_DATA]: setEncryptedBackupData,
  [CRYPTO_SET_BACKUP_VERSION]: setEncryptedBackupVersion,
  [CRYPTO_INITIALIZE]: initialize,
  [CRYPTO_LOAD_SECRETS]: loadSecrets,
  [CRYPTO_ADD_BOX_SECRET_KEY]: addBoxSecretKey,
  [CRYPTO_IMPORT_SECRET_KEYS]: importSecretKeys,
  [CRYPTO_SET_BACKUP_KEY_SHARE]: setBackupKeyShare,
  [CRYPTO_SET_BOX_KEY_SHARE]: setBoxKeyShare,
});

export default persistReducer(
  { key: 'crypto', storage, whitelist: ['backupKeyShares'], blacklist: [] },
  cryptoReducer,
);
