import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { selectors as authSelectors } from '@misakey/auth/store/reducers/auth';
import { selectors as devicePreferencesSelector } from 'store/reducers/devicePreferences';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { getThemeOptions } from '@misakey/ui/theme';

import isEmpty from '@misakey/helpers/isEmpty';

function ThemeProvider({ children, previewColor }) {
  // @FIXME if we want to use mediaquery to define darkmode from user preferencies
  // import useMediaQuery from '@material-ui/core/useMediaQuery';
  // const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const identity = useSelector(authSelectors.identity);
  const isDarkMode = useSelector(devicePreferencesSelector.getIsDarkMode);
  const color = useMemo(
    () => {
      if (!isEmpty(previewColor)) {
        return previewColor;
      }
      return isEmpty(identity) ? null : identity.color;
    },
    [identity, previewColor],
  );

  const theme = React.useMemo(
    () => createMuiTheme(getThemeOptions(isDarkMode, color)),
    [isDarkMode, color],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.elementType]).isRequired,
  previewColor: PropTypes.string,
};

ThemeProvider.defaultProps = {
  previewColor: null,
};

export default ThemeProvider;
