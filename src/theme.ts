import { createTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";

export const brandColors = {
  primary: "#0f4c81",
  primaryDark: "#0a365c",
  secondary: "#00a8e8",
  accent: "#00a7ff",
  midnight: "#071a3c",
};

export const brandGradients = {
  midnight: `linear-gradient(135deg, ${brandColors.midnight} 0%, #0c5fa3 100%)`,
  halo: `linear-gradient(135deg, rgba(15, 76, 129, 0.05) 0%, rgba(0, 167, 255, 0.05) 100%)`,
};

export const brandShadows = {
  emblem: "none",
  card: "none",
  cta: "none",
};

export const glassPanelCardSx: SxProps<Theme> = {
  borderRadius: 1,
  border: "1px solid rgba(255,255,255,0.4)",
  background: "none",
  backdropFilter: "blur(14px)",
  boxShadow: brandShadows.card,
};

export const formFieldStyles: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "#e4ecf7" },
    "&:hover fieldset": { borderColor: brandColors.primary },
    "&.Mui-focused fieldset": {
      borderColor: brandColors.primary,
      boxShadow: "none",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 600,
    fontSize: 14,
  },
  "& input, & .MuiInputBase-input": {
    fontSize: 14,
    "&::placeholder": {
      fontSize: 14,
    },
  },
};

const theme = createTheme({
  palette: {
    primary: {
      main: brandColors.primary,
    },
    secondary: {
      main: brandColors.secondary,
    },
    background: {
      default: "#f5f7fb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #e0e6f0",
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;
