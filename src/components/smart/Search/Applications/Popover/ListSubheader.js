import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { SUGGESTED_TYPE, LINKED_TYPE } from 'constants/search/application/type';

import omitTranslationProps from 'helpers/omit/translationProps';

import useLocationWorkspace from 'hooks/useLocationWorkspace';

import ListSubheader from '@material-ui/core/ListSubheader';

// COMPONENTS
const SearchApplicationsPopoverListSubheader = ({
  t,
  type,
  ...rest
}) => {
  const workspace = useLocationWorkspace();

  const transPath = useMemo(
    () => (type === LINKED_TYPE
      ? `${type}.${workspace}`
      : type),
    [type, workspace],
  );

  return (
    <ListSubheader component="div" {...omitTranslationProps(rest)}>{t(`common:application.${transPath}.title`)}</ListSubheader>
  );
};

SearchApplicationsPopoverListSubheader.propTypes = {
  type: PropTypes.oneOf([SUGGESTED_TYPE, LINKED_TYPE]).isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation('common')(SearchApplicationsPopoverListSubheader);
