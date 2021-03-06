import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import isNil from '@misakey/helpers/isNil';

import { useFileContext } from 'components/smart/File/Context';

import ContextMenuItem from '@misakey/ui/Menu/ContextMenu/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';

import DownloadIcon from '@material-ui/icons/GetApp';

// COMPONENTS
const MenuItemDownloadEvent = forwardRef(({ t }, ref) => {
  const { onDownloadFile, error } = useFileContext();

  return (
    <ContextMenuItem ref={ref} onClick={onDownloadFile} disabled={!isNil(error)}>
      <ListItemIcon>
        <DownloadIcon />
      </ListItemIcon>
      <ListItemText primary={t('common:download')} />
    </ContextMenuItem>
  );
});

MenuItemDownloadEvent.propTypes = {
  // withTranslation
  t: PropTypes.func.isRequired,
};

export default withTranslation('common', { withRef: true })(MenuItemDownloadEvent);
