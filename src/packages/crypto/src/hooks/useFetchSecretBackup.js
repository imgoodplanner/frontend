import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectors as authSelectors } from '@misakey/auth/store/reducers/auth';
import isNil from '@misakey/helpers/isNil';
import useFetchEffect from '@misakey/hooks/useFetch/effect';
import { getEncryptedSecretsBackup } from '../HttpApi';
import { storeEncryptedBackupData } from '../store/actions/concrete';
import { selectors } from '../store/reducers';

// CONSTANTS
const { isAuthenticated: IS_AUTH_SELECTOR, accountId: ACCOUNT_ID_SELECTOR } = authSelectors;

// HOOKS
export default (() => {
  const areSecretsLoaded = useSelector(selectors.areSecretsLoaded);
  const dispatch = useDispatch();

  const accountId = useSelector(ACCOUNT_ID_SELECTOR);
  const { backupVersion, data } = useSelector(selectors.getEncryptedBackupData);
  const isAuthenticated = useSelector(IS_AUTH_SELECTOR);

  const onGetEncryptedSecretsBackup = useCallback(
    () => getEncryptedSecretsBackup(accountId), [accountId],
  );

  const shouldFetch = useMemo(
    () => !areSecretsLoaded && isNil(data) && !isNil(accountId) && isAuthenticated,
    [accountId, areSecretsLoaded, data, isAuthenticated],
  );
  const onSuccess = useCallback(
    (result) => dispatch(storeEncryptedBackupData(
      { data: result.data, backupVersion: result.version },
    )), [dispatch],
  );

  const { isFetching } = useFetchEffect(
    onGetEncryptedSecretsBackup,
    { shouldFetch },
    { onSuccess },
  );

  return {
    backupVersion,
    data,
    isFetching,
    isReady: areSecretsLoaded || isNil(accountId) || !isNil(data),
  };
});
