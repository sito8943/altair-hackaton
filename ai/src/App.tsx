import { useState } from "react";
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Fade,
  LinearProgress,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Dashboard from "./components/Dashboard";
import HealthStepperForm from "./components/HealthStepperForm";
import { predictRisk } from "./services/api";
import type { PredictionPayload, PredictionResult } from "./types";
import theme, { brandColors, brandShadows } from "./theme";

const App = () => {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (payload: PredictionPayload) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await predictRisk(payload);
      setResult(data);
    } catch (err) {
      const fallbackMessage =
        "Unable to reach the prediction API. Verify the backend service and try again.";
      if (err && typeof err === "object" && "response" in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message ?? fallbackMessage);
      } else {
        setError(fallbackMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: brandColors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: brandShadows.emblem,
              }}
            >
              <Typography variant="h6" sx={{ color: "white", fontWeight: 800 }}>
                HR
              </Typography>
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{ letterSpacing: 0.5, color: brandColors.primary }}
            >
              Health Risk Command Center
            </Typography>
          </Stack>
          <HealthStepperForm onSubmit={handleSubmit} loading={loading} />
          {loading && <LinearProgress sx={{ mt: 3 }} />}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          <Fade in={Boolean(result)} timeout={400}>
            <Box>
              <Dashboard result={result} />
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
