import { createTheme } from '@mui/material/styles';
import { COLORS } from './const/colors';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: COLORS.brand.primary,
    },
    text: {
      primary: COLORS.text.primary,
      secondary: COLORS.text.secondary,
    },
    divider: COLORS.surface.border,
    background: {
      default: COLORS.surface.bg,
      paper: COLORS.surface.card,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
          textTransform: 'none',
          borderRadius: '0.5rem',
        },
        containedPrimary: {
          backgroundColor: COLORS.brand.primary,
          color: COLORS.surface.card,
          '&:hover': {
            backgroundColor: COLORS.brand.dark,
          },
          '&:focus': {
            outline: `2px solid ${COLORS.brand.primary}`,
            outlineOffset: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: COLORS.surface.inputBorder },
            '&:hover fieldset': { borderColor: COLORS.text.secondary },
            '&.Mui-focused fieldset': { borderColor: COLORS.brand.primary },
          },
          '& .MuiInputLabel-root': { color: COLORS.text.secondary },
          '& .MuiInputLabel-root.Mui-focused': { color: COLORS.brand.primary },
          '& .MuiInputBase-input': { color: COLORS.text.primary },
        },
      },
    },
  },
});