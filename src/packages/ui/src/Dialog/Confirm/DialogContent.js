import React from 'react';
import PropTypes from 'prop-types';

import isString from '@misakey/helpers/isString';

import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

const ConfirmDialogContent = ({ children }) => {
  if (isString(children)) {
    return (
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
      </DialogContent>
    );
  }
  return (
    <DialogContent>
      {children}
    </DialogContent>
  );
};

ConfirmDialogContent.propTypes = {
  children: PropTypes.node,
};

ConfirmDialogContent.defaultProps = {
  children: null,
};

export default ConfirmDialogContent;
