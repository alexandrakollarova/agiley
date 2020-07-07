import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import NunitoRegular from './font/Nunito-Regular.ttf'

const nunito = {
  fontFamily: 'Nunito',
  fontStyle: 'normal',
  fontDisplay: 'swap',
  fontWeight: 400,
  src: `
    local('Nunito'),
    local('Nunito-Regular'),
    url(${NunitoRegular}) format('ttf')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
}

let theme = createMuiTheme({
  typography: {
    fontFamily: ['Nunito, sans-serif'].join(','),
    h1: {
      color: '#707070'
    },
    h2: {
      color: '#707070'
    },
    h3: {
      color: '#707070'
    },
    h4: {
      color: '#707070'
    },
    h5: {
      color: '#707070'
    },
    h6: {
      color: '#707070'
    },
    subtitle1: {
      color: '#707070'
    },
    body1: {
      color: '#707070'
    },
    subtitle2: {
      color: '#707070'
    },
    body2: {
      color: '#707070'
    },
    overline: {
      color: '#707070'
    },
    button: {
      color: '#707070'
    }
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [nunito]
      }
    },
    MuiInputBase: {
      root: {
        color: '#FF911E'

      },
      input: {
        "&::placeholder": {
          color: '#FF911E',
          opacity: 1
        }
      }
    }
  },
  palette: {
    blue: {
      main: '#282EBA',
    },
    orange: {
      main: '#FEBB46',
      dark: '#FF911E'
    },
    purple: {
      main: 'rgba(103, 116, 255, 0.7)'
    },
    greyGradient: {
      main: 'linear-gradient(to bottom right, white, rgba(227, 227, 227, 0.8))'
    },
    gradient: {
      main: '-webkit-linear-gradient(#FEBB46, #282EBA, rgba(103, 116, 255, 0.7))'
    }
  }
})

theme = responsiveFontSizes(theme)

export default theme