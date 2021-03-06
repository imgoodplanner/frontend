import { useCallback, useContext } from 'react';
import { UserManagerContext } from '@misakey/auth/components/OidcProvider';

export default (canCancel = true) => {
  const { askSigninRedirect } = useContext(UserManagerContext);

  return useCallback(
    (options) => askSigninRedirect(options, canCancel),
    [askSigninRedirect, canCancel],
  );
};
