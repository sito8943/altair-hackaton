import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  LinearProgress,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import HealthStepperForm from "./components/HealthStepperForm";
import mockPredictionResult from "./data/mockPredictionResult";
import { checkApiHealth, predictRisk } from "./services/api";
import { LATEST_PREDICTION_RESULT_KEY } from "./constants/storageKeys";
import { normalizePredictionResult } from "./utils/normalizeResult";
import type { PredictionPayload, PredictionResult } from "./types";
import theme, { brandColors, brandShadows } from "./theme";
import { ENABLE_MOCK_API } from "./config/featureFlags";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [healthMessage, setHealthMessage] = useState("");
  const [healthError, setHealthError] = useState(false);
  const navigate = useNavigate();
  const useMockApi = ENABLE_MOCK_API;

  const persistAndNavigate = (prediction: PredictionResult) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        LATEST_PREDICTION_RESULT_KEY,
        JSON.stringify(prediction)
      );
    }
    navigate("/intake/result", { state: { result: prediction } });
  };

  useEffect(() => {
    if (useMockApi) {
      setHealthMessage("");
      setHealthError(false);
      return;
    }
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const { data } = await checkApiHealth();
        if (!isMounted) return;
        if (data?.status?.toLowerCase() === "ok") {
          setHealthMessage("");
          setHealthError(false);
        } else {
          setHealthMessage(
            "Prediction service responded but did not report an OK status."
          );
          setHealthError(true);
        }
      } catch (err) {
        if (!isMounted) return;
        setHealthMessage(
          "Unable to reach the prediction service at http://localhost:8001/health."
        );
        setHealthError(true);
      }
    };
    checkHealth();
    return () => {
      isMounted = false;
    };
  }, [useMockApi]);

  const handleSubmit = async (payload: PredictionPayload) => {
    setLoading(true);
    setError("");
    try {
      if (useMockApi) {
        await new Promise((resolve) => setTimeout(resolve, 750));
        persistAndNavigate(mockPredictionResult);
        return;
      }
      const { data } = await predictRisk(payload);
      persistAndNavigate(normalizePredictionResult(data));
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
          background:
            "linear-gradient(180deg,#fdfefe 0%,#eaf4fb 50%,#e2f0f8 100%)",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
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
          {!useMockApi && healthError && healthMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {healthMessage}
            </Alert>
          )}
          <HealthStepperForm
            onSubmit={handleSubmit}
            loading={loading}
            apiError={error}
          />
          {loading && <LinearProgress sx={{ mt: 3 }} />}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default App;
