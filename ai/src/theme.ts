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
  midnight: `linear-gradient(135deg, ${brandColors.midnight} 0%, ${brandColors.primary} 100%)`,
  halo: `linear-gradient(135deg, rgba(15, 76, 129, 0.05) 0%, rgba(0, 167, 255, 0.05) 100%)`,
};

export const brandShadows = {
  emblem: "0 8px 16px rgba(15,76,129,0.2)",
  card: "0 25px 60px rgba(9,29,66,0.12)",
  cta: "0 10px 20px rgba(15,76,129,0.3)",
};

export const glassPanelCardSx: SxProps<Theme> = {
  borderRadius: 1,
  border: "1px solid rgba(255,255,255,0.4)",
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(14px)",
  boxShadow: brandShadows.card,
};

export const formFieldStyles: SxProps<Theme> = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 3,
    backgroundColor: "#fff",
    transition: "all 0.3s ease",
    "& fieldset": { borderColor: "#e4ecf7" },
    "&:hover fieldset": { borderColor: brandColors.primary },
    "&.Mui-focused fieldset": {
      borderColor: brandColors.primary,
      boxShadow: "0 0 0 3px rgba(15,76,129,0.08)",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 600,
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
          boxShadow: "0 12px 40px rgba(15,76,129,0.06)",
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
