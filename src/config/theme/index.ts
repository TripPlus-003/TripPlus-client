import { extendTheme } from '@chakra-ui/react';
import tailwindConfig from '../../../tailwind.config';
import resolveConfig from 'tailwindcss/resolveConfig';

const tailwind = resolveConfig(tailwindConfig) as any;

// Extend the theme to include custom colors, fonts, etc
const colors = {
  black: '#000',
  white: '#fff',
  primary: tailwind.theme?.colors?.primary,
  'secondary-emphasis': tailwind.theme?.colors?.['secondary-emphasis'],
  secondary: tailwind.theme?.colors?.secondary,
  success: tailwind.theme?.colors?.success,
  light: tailwind.theme?.colors?.light,
  gray: tailwind.theme?.colors?.gray,
  'secondary-light': tailwind.theme?.colors?.['secondary-light'],
  red: tailwind.theme?.colors?.red
};

const components = {
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',

          _focus: {
            borderColor: 'primary.500',
            boxShadow: 'none'
          },

          _disabled: {
            opacity: '1',
            borderColor: 'gray.300',
            backgroundColor: 'gray.100'
          }
        }
      }
    }
  },
  Select: {
    variants: {
      outline: {
        field: {
          borderColor: 'gray.300',

          _focus: {
            borderColor: 'primary.500',
            boxShadow: 'none'
          },

          _disabled: {
            opacity: '1',
            borderColor: 'gray.300',
            backgroundColor: 'gray.100'
          }
        }
      }
    }
  },
  Textarea: {
    variants: {
      outline: {
        borderColor: 'gray.300',
        _focus: {
          borderColor: 'primary.500',
          boxShadow: 'none'
        },

        _disabled: {
          opacity: '1',
          borderColor: 'gray.300',
          backgroundColor: 'gray.100'
        }
      }
    }
  },
  Checkbox: {
    baseStyle: {
      control: {
        _checked: {
          bg: 'primary.600',
          borderColor: 'primary.600'
        },
        _hover: {
          borderColor: 'primary.300'
        }
      }
    }
  }
};

export const theme = extendTheme({
  colors,
  breakpoints: { base: '0px', ...tailwind.theme.screens },
  sizes: {
    container: {
      ...tailwind.theme.screens
    }
  },
  components
});
