import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Grow,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import theme, { brandColors } from "../theme";
import RiskGauge from "./RiskGauge";
import mockPredictionResult from "../data/mockPredictionResult";
import { LATEST_PREDICTION_RESULT_KEY } from "../constants/storageKeys";
import type { PredictionResult } from "../types";

const panelCardSx: SxProps<Theme> = {
  borderRadius: 1,
  border: "1px solid rgba(15, 30, 50, 0.06)",
  background:
    "linear-gradient(180deg, rgba(255,253,248,0.95) 0%, rgba(241,251,255,0.98) 100%)",
  boxShadow: "none",
};

const recommendedActions = [
  "Schedule a telehealth consult focusing on hypertension control strategies.",
  "Trigger sleep hygiene coaching workflow via care navigator.",
  "Share mindfulness resources to reduce the stress marker from 8 → 5.",
];

const vitalSignals = [
  {
    label: "Blood pressure trend",
    value: "138 / 92 mmHg",
    helper: "+6 mmHg avg surge vs baseline",
  },
  {
    label: "Activity adherence",
    value: "42%",
    helper: "3 of last 7 days met target",
  },
  {
    label: "Sleep efficiency",
    value: "72%",
    helper: "Average 5.8 hrs vs 7.5 hr goal",
  },
];

const ResultView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routedResult = (location.state as { result?: PredictionResult } | null)?.result;
  const [showScrollTop, setShowScrollTop] = useState(false);

  const storedResult = (() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(LATEST_PREDICTION_RESULT_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PredictionResult;
    } catch (error) {
      console.warn("Unable to parse stored prediction result", error);
      return null;
    }
  })();

  const result = routedResult ?? storedResult ?? mockPredictionResult;

  const percentScore = Math.round((result.risk_score ?? 0) * 100);
  const trendIncreasing = (result.trend_signal || "")
    .toLowerCase()
    .includes("increase");

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleScroll = () => setShowScrollTop(window.scrollY > 240);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, rgba(242,247,255,1) 0%, rgba(233,244,251,1) 40%, #f5f8fb 100%)",
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    bgcolor: brandColors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}
                >
                  HR
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                    Patient-focused response
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    Command Center / Resultado
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/intake/demographics")}
                >
                  Regresar a intake
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Exportar PDF
                </Button>
              </Stack>
            </Stack>
            <Box>
              <Card elevation={0} sx={panelCardSx}>
                <CardContent>
                  <Stack spacing={2}>
                      <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                        Resumen predictivo
                      </Typography>
                      <Stack
                        direction={{ xs: "column", lg: "row" }}
                        spacing={3}
                        alignItems={{ xs: "flex-start", lg: "center" }}
                      >
                        <Typography variant="h3" fontWeight={700}>
                          {percentScore}%
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Chip
                            label={result.risk_level || "Sin dato"}
                            color={trendIncreasing ? "error" : "success"}
                            sx={{ fontWeight: 600 }}
                          />
                          <Stack direction="row" spacing={1} alignItems="center">
                            <TrendingUpIcon color={trendIncreasing ? "error" : "success"} />
                            <Typography variant="body2" color="text.secondary">
                              {result.trend_signal || "Sin señal longitudinal"}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Normalizado 0-1
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={percentScore}
                          color={trendIncreasing ? "error" : "success"}
                          sx={{ mt: 1, height: 10, borderRadius: 999 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Interpretación mockeada ligada a la respuesta del modelo para los próximos 30 días.
                      </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: { xs: 2, md: 3 },
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                alignItems: "stretch",
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gap: { xs: 2, md: 3 },
                  gridTemplateRows: {
                    xs: "auto",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                }}
              >
                <Card elevation={0} sx={panelCardSx}>
                  <CardContent>
                    <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                      Gauge de riesgo
                    </Typography>
                    <Box sx={{ height: 280, mt: 1 }}>
                      <RiskGauge score={result.risk_score} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Score normalizado para dimensionar la probabilidad.
                    </Typography>
                  </CardContent>
                </Card>
                <Card elevation={0} sx={panelCardSx}>
                  <CardContent>
                    <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                      Factores principales
                    </Typography>
                    <Stack spacing={2} mt={2}>
                      {(result.top_factors || []).slice(0, 4).map((factor) => (
                        <Box key={`${factor.name}-${factor.impact}`}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography fontWeight={600}>{factor.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {Math.round((factor.impact ?? 0) * 100)}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={Math.round((factor.impact ?? 0) * 100)}
                            color={
                              factor.impact > 0.3
                                ? "error"
                                : factor.impact > 0.15
                                ? "warning"
                                : "success"
                            }
                            sx={{ mt: 1, height: 8, borderRadius: 999 }}
                          />
                        </Box>
                      ))}
                      {!result.top_factors?.length && (
                        <Typography variant="body2" color="text.secondary">
                          El servicio no retornó factores destacados.
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </Card>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gap: { xs: 2, md: 3 },
                  gridTemplateRows: {
                    xs: "auto",
                    md: "repeat(2, minmax(0, 1fr))",
                  },
                }}
              >
                <Card elevation={0} sx={panelCardSx}>
                  <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                      Acciones sugeridas
                    </Typography>
                    <Stack spacing={2.5} mt={1}>
                      {recommendedActions.map((action) => (
                        <Box
                          key={action}
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "flex-start",
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: "rgba(15,76,129,0.04)",
                          }}
                        >
                          <Box
                            sx={{
                              width: 36,
                              height: 36,
                              borderRadius: "50%",
                              backgroundColor: "rgba(102,187,106,0.15)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "success.main",
                              flexShrink: 0,
                            }}
                          >
                            <CheckCircleIcon fontSize="small" />
                          </Box>
                          <Box>
                            <Typography fontWeight={600}>{action}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              Prioridad inmediata
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
                <Card elevation={0} sx={panelCardSx}>
                  <CardContent>
                    <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                      Señales vitales
                    </Typography>
                    <Stack divider={<Divider flexItem />} spacing={2.5} mt={2}>
                      {vitalSignals.map((signal) => (
                        <Box key={signal.label}>
                          <Typography variant="caption" color="text.secondary">
                            {signal.label}
                          </Typography>
                          <Typography variant="h5" fontWeight={700}>
                            {signal.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {signal.helper}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Grow in={showScrollTop} timeout={{ enter: 260, exit: 200 }} unmountOnExit>
        <IconButton
          aria-label="Volver arriba"
          onClick={scrollToTop}
          sx={{
            position: "fixed",
            right: 24,
            bottom: 24,
            bgcolor: brandColors.primary,
            color: "#fff",
            boxShadow: "0 8px 30px rgba(15,76,129,0.3)",
            transition: "transform 240ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms ease",
            "&:hover": {
              bgcolor: brandColors.primaryDark,
              transform: "scale(1.05) translateY(-2px)",
              boxShadow: "0 12px 30px rgba(15,76,129,0.35)",
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
      </Grow>
    </ThemeProvider>
  );
};

export default ResultView;
