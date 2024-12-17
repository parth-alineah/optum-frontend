// All the context regarding the web are defined here
// This particular context states the override styles for MUI components and other sufficient style requirements
import React, { ReactNode } from 'react'
import { createTheme, Theme } from '@mui/material/styles'
import { ThemeProvider } from '@mui/material'
import { PaletteColor } from '../types/common'

declare module '@mui/material/styles' {
  interface Palette {
    mPink?: PaletteColor
  }
  interface Palette {
    mBlack?: PaletteColor
  }
  interface Palette {
    mLightBlack?: PaletteColor
  }
  interface Palette {
    mDarkBlue?: PaletteColor
  }
  interface Palette {
    mMidBlue?: PaletteColor
  }
  interface Palette {
    mBlue?: PaletteColor
  }
  interface Palette {
    mLightBlue?: PaletteColor
  }
  interface Palette {
    mLightGray?: PaletteColor
  }
  interface Palette {
    mGray?: PaletteColor
  }
  interface Palette {
    mMediumGray?: PaletteColor
  }
  interface Palette {
    mDarkGray?: PaletteColor
  }
  interface Palette {
    mOrange?: PaletteColor
  }
  interface Palette {
    mLightOrange?: PaletteColor
  }
  interface Palette {
    mGreen?: PaletteColor
  }
  interface Palette {
    mYellow?: PaletteColor
  }
  interface Palette {
    mWhite?: PaletteColor
  }
  interface Palette {
    mDarkestGray?: PaletteColor
  }
  interface PaletteOptions {
    mPink?: PaletteColor
  }
  interface PaletteOptions {
    mBlack?: PaletteColor
  }
  interface PaletteOptions {
    mLightBlack?: PaletteColor
  }
  interface PaletteOptions {
    mDarkBlue?: PaletteColor
  }
  interface PaletteOptions {
    mMidBlue?: PaletteColor
  }
  interface PaletteOptions {
    mBlue?: PaletteColor
  }
  interface PaletteOptions {
    mLightBlue?: PaletteColor
  }
  interface PaletteOptions {
    mLightGray?: PaletteColor
  }
  interface PaletteOptions {
    mGray?: PaletteColor
  }
  interface PaletteOptions {
    mMediumGray?: PaletteColor
  }
  interface PaletteOptions {
    mDarkGray?: PaletteColor
  }
  interface PaletteOptions {
    mOrange?: PaletteColor
  }
  interface PaletteOptions {
    mGreen?: PaletteColor
  }
  interface PaletteOptions {
    mDarkestGray?: PaletteColor
  }
  interface PaletteOptions {
    mYellow?: PaletteColor
  }
  interface PaletteOptions {
    mWhite?: PaletteColor
  }
  interface PaletteOptions {
    mLightOrange?: PaletteColor
  }
  interface TypographyVariants {
    btnTxt: React.CSSProperties
  }
  interface TypographyVariantsOptions {}
}

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: true
    sm: true
    md: true
    lg: true
    xl: true
    '2xl': true
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    dashed: true
  }
  interface ButtonPropsColorOverrides {
    mPink: true
    mLightBlack: true
    mOrange: true
    mYellow: true
    mGreen: true
    mBlue: true
    mWhite: true
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {}
}

type Props = {
  children: ReactNode
}

export const theme: Theme = createTheme({
  palette: {
    mPink: {
      // main: '#e20074',
      main: '#e20074',
      dark: '#e20074',
      light: '#e20074',
    },
    mDarkBlue: {
      // main: '#003876',
      main: '#3441a4',
      light: '#3441a4',
      dark: '#3441a4',
    },
    mMidBlue: {
      main: '#d9e3f8',
      light: '#d9e3f8',
      dark: '#d9e3f8',
    },
    mBlue: {
      main: '#095aac',
      light: '#095aac',
      dark: '#095aac',
    },
    mLightBlue: {
      main: '#d9e3f8',
      light: '#d9e3f8',
      dark: '#d9e3f8',
    },
    mLightGray: {
      main: '#F5F5F5',
      light: '#F5F5F5',
      dark: '#F5F5F5',
    },
    mGray: {
      main: '#d4d4d4',
      light: '#d4d4d4',
      dark: '#d4d4d4',
    },
    mMediumGray: {
      main: '#c1c1c4',
      light: '#c1c1c4',
      dark: '#c1c1c4',
    },
    mDarkGray: {
      main: '#787d78',
      light: '#787d78',
      dark: '#787d78',
    },
    mOrange: {
      main: '#FF0000',
      light: '#FF0000',
      dark: '#FF0000',
    },
    mLightOrange: {
      main: '#de605d',
      light: '#de605d',
      dark: '#de605d',
    },
    mGreen: {
      main: '#08ac20',
      light: '#08ac20',
      dark: '#08ac20',
    },
    mYellow: {
      main: '#f0c51a',
      light: '#f0c51a',
      dark: '#f0c51a',
    },
    mWhite: {
      main: '#ffffff',
      light: '#ffffff',
      dark: '#ffffff',
    },
    mLightBlack: {
      main: '#2b2a2a',
      light: '#2b2a2a',
      dark: '#2b2a2a',
    },
    mBlack: {
      main: '#2B2A2A',
      light: '#2B2A2A',
      dark: '#2B2A2A',
    },
    mDarkestGray: {
      main: '#434655',
      light: '#434655',
      dark: '#434655',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1000,
      xl: 1200,
      '2xl': 1536,
    },
  },
  typography: {
    fontFamily: 'Roboto, sans',
    button: {
      fontFamily: 'Roboto, sans',
      fontWeight: 'bolder',
      letterSpacing: 1,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 30,
          minWidth: 200,
          maxWidth: 200,
          lineHeight: 2,
          textTransform: 'none',
          color: '#2B2A2A',
          ':disabled': {
            backgroundColor: '#787d78',
            color: '#ffffff',
          },
        },
      },
      defaultProps: {
        disableRipple: false,
        color: 'error',
        variant: 'contained',
      },
    },
    MuiInputBase: {},
    MuiInputLabel: {
      defaultProps: { shrink: true },
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: 'black',
            fontWeight: 700,
          },
          '&.Mui-error': {
            color: '#de605d',
            fontWeight: 700,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              border: `2px solid black`,
            },
            '& .MuiFormLabel-root.MuiInputLabel-root': {
              color: 'black', // Change the color to your desired color
            },
          },
          '&.Mui-error': {
            '& .MuiOutlinedInput-notchedOutline': {
              border: `2px solid #de605d`,
            },
          },
          '&.Mui-hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              border: `1px solid black`,
            },
          },
          '& .MuiInputBase-input::placeholder': {
            fontSize: '14px',
            paddingLeft: '5px',
          },
          borderRadius: '3px',
        },
        input: {
          padding: '6px',
          width: '100%',
        },
        notchedOutline: {
          border: `1px solid #787d78`,
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#e20074',
          },
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '.MuiOutlinedInput-root': {
            padding: '0px 5px',
            height: 36,
            '& .MuiAutocomplete-input': {
              padding: '0px',
            },
            '& .MuiInputBase-input::placeholder': {
              fontSize: '14px',
              paddingLeft: '5px',
            },
          },
        },
        popper: {
          boxShadow:
            '0px 2px 4px rgba(0, 0, 0, 0.4), 0px 7px 13px -3px rgba(0, 0, 0, 0.3), inset 0px -3px 0px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#000000',
            fontWeight: 500,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTab: {},
    MuiSwitch: {
      styleOverrides: {
        root: {
          '.Mui-checked': {
            // color: '#3441A3',
            '.MuiSwitch-thumb': {
              color: '#08ac20',
            },
          },
          '.MuiSwitch-thumb': {
            color: '#de605d',
          },
          '.MuiSwitch-track': {
            backgroundColor: '#d4d4d4 !important',
          },
          '.MuiSwitch-switchBase': {},
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '.MuiPaginationItem-previousNext': {
            color: '#A9A9A9',
            border: '0px',
          },
          '.MuiButtonBase-root': {
            color: '#A9A9A9',
          },
          '.Mui-selected': {
            border: '0px',
            backgroundColor: '#095aac !important',
            color: '#ffffff',
            fontWeight: '700',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          // '.MuiSvgIcon-root': {
          //   fill: 'black',
          // },
          // '.Mui-disabled': {
          //   color: 'yellow',
          // },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'white',
          color: '#000000',
          fontSize: 16,
          lineHeight: 2,
          fontWeight: 400,
          boxShadow: '0px 2px 8px #A9A9A9',
          maxWidth: '700px',
        },
        arrow: {
          color: 'white',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(52, 65, 163, 0.7)',
          fontWeight: '500',
        },
      },
    },
  },
})

const AppThemeProvider = ({ children }: Props) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default AppThemeProvider
