import { createMuiTheme } from '@material-ui/core/styles';
import common from '@misakey/ui/colors/common';
import boulder from '@misakey/ui/colors/boulder';

import isEmpty from '@misakey/helpers/isEmpty';

// CONSTANTS
const DARK_BG = '#303030';
const LIGHT_BG = '#fff';

// THEME
export const getThemeOptions = (isDarkMode = false, color = null) => ({
  palette: {
    type: isDarkMode ? 'dark' : 'light',
    primary: {
      main: common.primary,
    },
    secondary: {
      main: isEmpty(color) ? common.secondary : color,
    },
    error: (isEmpty(color) || color === common.secondary) ? ({
      main: common.secondary,
    }) : undefined,
    background: {
      message: isDarkMode ? '#555555' : '#F5F5F5',
      paper: isDarkMode ? DARK_BG : LIGHT_BG,
      default: isDarkMode ? DARK_BG : LIGHT_BG,
    },
    action: {
      selected: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    },
    grey: boulder,
    reverse: isDarkMode ? LIGHT_BG : DARK_BG,
  },
  typography: {
    useNextVariants: true,
  },
  zIndex: {
    max: 2000,
  },
  overrides: {
    MuiButton: {
      root: {
        boxShadow: 'none !important',
        borderRadius: 50,
      },
    },
    MuiCardContent: {
      root: {
        '&:last-child': {
          paddingBottom: null,
        },
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: '10px',
      },
    },
    MuiListItem: {
      root: {
        '&.Mui-selected': {
          borderLeftWidth: 3,
          borderLeftStyle: 'solid',
          borderLeftColor: isEmpty(color) ? common.secondary : color,
          '&.MuiListItem-gutters': {
            paddingLeft: 13,
          },
        },
      },
    },
    MuiExpansionPanel: {
      root: {
        '&::before': {
          display: 'none',
        },
        // https://github.com/mui-org/material-ui/issues/20058#issuecomment-601777593
        '&.Mui-disabled': {
          backgroundColor: 'unset',
        },
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        padding: 0,
        '& > ul': {
          width: '100%',
        },
      },
    },
    MuiExpansionPanelSummary: {
      content: {
        margin: 'auto 0',
        '&.Mui-expanded': {
          margin: 'auto 0',
        },
        alignItems: 'center',
      },
    },
  },
});

export default createMuiTheme(getThemeOptions());
