import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { Link } from 'react-router-dom';

import routes from 'routes';
import { IS_PLUGIN } from 'constants/plugin';

import omitTranslationProps from 'helpers/omit/translationProps';
import isNil from '@misakey/helpers/isNil';
import { redirectToApp } from 'helpers/plugin';

import useLocationWorkspace from 'hooks/useLocationWorkspace';

import MUILink from '@material-ui/core/Link';

// HOOKS
const useStyles = makeStyles(() => ({
  linkRoot: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
}));

// COMPONENTS
const LinkHome = ({ t, children, ...rest }) => {
  const classes = useStyles();

  const workspace = useLocationWorkspace(true);

  const to = useMemo(
    () => (isNil(workspace) ? routes._ : (routes[workspace]._ || routes._)),
    [workspace],
  );

  const onClick = useCallback(
    () => redirectToApp(to),
    [to],
  );

  const routingProps = useMemo(
    () => (IS_PLUGIN
      ? { onClick, component: 'button' }
      : { component: Link, to }),
    [onClick, to],
  );

  return (
    <MUILink
      {...routingProps}
      underline="none"
      classes={{ root: classes.linkRoot }}
      {...omitTranslationProps(rest)}
    >
      {children}
    </MUILink>
  );
};

LinkHome.propTypes = {
  t: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default withTranslation('common')(LinkHome);
