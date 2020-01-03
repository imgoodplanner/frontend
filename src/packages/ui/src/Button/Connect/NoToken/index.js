import React, { useCallback, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';

import isNil from '@misakey/helpers/isNil';
import isObject from '@misakey/helpers/isObject';
import nestedClasses from '@misakey/helpers/nestedClasses';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

// HELPERS
const getIconButtonClasses = (classes) => nestedClasses(classes, 'iconButton', 'button');

const getButtonClasses = (classes) => nestedClasses(classes, 'button', 'iconButton');

// COMPONENTS
const ButtonConnectNoToken = forwardRef(({
  token,
  className,
  classes,
  buttonProps,
  Icon,
  children,
  signInAction,
}, ref) => {
  const onClick = useCallback(
    () => { signInAction(); },
    [signInAction],
  );

  const iconButtonClassProps = useMemo(
    () => (isObject(classes) ? { classes: getIconButtonClasses(classes) } : { className }),
    [classes, className],
  );

  const buttonClassProps = useMemo(
    () => (isObject(classes) ? { classes: getButtonClasses(classes) } : { className }),
    [classes, className],
  );

  if (token) { return null; }
  if (!isNil(Icon)) {
    return (
      <IconButton ref={ref} color="secondary" {...buttonProps} {...iconButtonClassProps} onClick={onClick}>
        {Icon}
      </IconButton>
    );
  }
  return (
    <Button ref={ref} className={className} color="secondary" {...buttonProps} {...buttonClassProps} onClick={onClick}>
      {children}
    </Button>
  );
});

ButtonConnectNoToken.propTypes = {
  buttonProps: PropTypes.object,
  children: PropTypes.node,
  classes: PropTypes.shape({
    button: PropTypes.object,
    iconButton: PropTypes.object,
  }),
  className: PropTypes.string,
  // ROUTER
  Icon: PropTypes.node,
  signInAction: PropTypes.func.isRequired,
  token: PropTypes.string,
};

ButtonConnectNoToken.defaultProps = {
  buttonProps: {},
  children: null,
  Icon: null,
  className: '',
  classes: null,
  token: null,
};

export default ButtonConnectNoToken;