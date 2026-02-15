import { useEffect, useMemo, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
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
  Grow,
  IconButton,
  LinearProgress,
  Slider,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import type { SxProps, Theme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import theme, { brandColors } from "../theme";
import RiskGauge from "./RiskGauge";
import mockPredictionResult from "../data/mockPredictionResult";
import "../styles/healthStepperAnimations.css";
import { LATEST_PREDICTION_RESULT_KEY } from "../constants/storageKeys";
import type { PredictionResult } from "../types";
import { normalizePredictionResult } from "../utils/normalizeResult";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

const panelCardSx: SxProps<Theme> = {
  borderRadius: 1,
  border: "1px solid rgba(15, 30, 50, 0.06)",
  background:
    "linear-gradient(180deg, rgba(255,253,248,0.95) 0%, rgba(241,251,255,0.98) 100%)",
  boxShadow: "none",
};

// 12-column Bento grid using calc-based percentages to avoid overflow from gaps
const dashboardGridSx: SxProps<Theme> = {
  "--grid-gap-sm": (theme) => theme.spacing(2.5),
  "--grid-gap-md": (theme) => theme.spacing(3),
  display: "grid",
  gridTemplateColumns: {
    xs: "100%",
    sm: "repeat(2, calc((100% - var(--grid-gap-sm)) / 2))",
    md: "repeat(12, calc((100% - 11 * var(--grid-gap-md)) / 12))",
  },
  gridAutoRows: "auto",
  columnGap: {
    xs: "var(--grid-gap-sm)",
    md: "var(--grid-gap-md)",
  },
  rowGap: {
    xs: "var(--grid-gap-sm)",
    md: "var(--grid-gap-md)",
  },
  alignItems: "stretch",
};

// Utility helper to express module spans within the 12-column layout
const gridColumnSpan = (mdSpan: number, smSpan = 2): SxProps<Theme> => ({
  gridColumn: {
    xs: "1 / -1",
    sm: `span ${smSpan}`,
    md: `span ${mdSpan}`,
  },
});

const cardPlacementSx = (mdSpan: number, smSpan = 2): SxProps<Theme> => ({
  ...panelCardSx,
  ...gridColumnSpan(mdSpan, smSpan),
});

const formatFactorName = (name: string) =>
  name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatDiseaseName = (name?: string) => {
  if (!name) return "N/A";
  return name.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const ResultView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const routedResult = (location.state as { result?: PredictionResult } | null)
    ?.result;
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [whatIfValues, setWhatIfValues] = useState({
    sleep: 7,
    activity: 4,
    stress: 5,
  });

  const storedResult = (() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(LATEST_PREDICTION_RESULT_KEY);
      if (!raw) return null;
      return normalizePredictionResult(JSON.parse(raw));
    } catch (error) {
      console.warn("Unable to parse stored prediction result", error);
      return null;
    }
  })();

  const normalizedRouteResult = routedResult
    ? normalizePredictionResult(routedResult)
    : null;

  const result = normalizedRouteResult ?? storedResult ?? mockPredictionResult;

  const overall = result.overall;
  const primaryDisease = result.disease_risks?.[0];
  const percentScore = Math.round((overall?.risk_score ?? 0) * 100);
  const trendSignal = primaryDisease?.trend_signal || "";
  const trendIncreasing = trendSignal.toLowerCase().includes("increase");

  const recommendedActions = useMemo(() => {
    if (result.recommendations?.length) return result.recommendations;
    return [
      "Increase weekly physical activity",
      "Improve sleep hygiene routine",
      "Monitor blood pressure daily",
    ];
  }, [result.recommendations]);

  const dataQuality = result.data_quality;
  const diseaseCards = useMemo(
    () => result.disease_risks?.slice(0, 5) ?? [],
    [result.disease_risks]
  );
  const riskFactors = useMemo(
    () => primaryDisease?.explanation?.top_risk_factors ?? [],
    [primaryDisease?.explanation?.top_risk_factors]
  );
  const protectiveFactors = useMemo(
    () => primaryDisease?.explanation?.top_protective_factors ?? [],
    [primaryDisease?.explanation?.top_protective_factors]
  );
  const fairnessMetrics = [
    { label: "Gender parity", score: 0.94, note: "Balanced within ±6%" },
    {
      label: "Ethnicity parity",
      score: 0.88,
      note: "Slight skew toward majority",
    },
    {
      label: "Calibration",
      score: 0.91,
      note: "Well calibrated in last month",
    },
  ];
  const radarColors = ["#0f4c81", "#00a8e8", "#f39c12", "#ef5350", "#66bb6a"];

  const radarData = useMemo(() => {
    if (!diseaseCards.length) return [];
    const axes = ["Probability", "Data confidence", "Trend"];
    const confidenceValue = Math.round(
      (overall?.data_quality_score ?? 0) * 100
    );
    return axes.map((axis) => {
      const entry: Record<string, string | number> = { metric: axis };
      diseaseCards.forEach((disease) => {
        const label = formatDiseaseName(disease.disease);
        if (axis === "Probability") {
          entry[label] = Math.round((disease.risk_probability ?? 0) * 100);
        } else if (axis === "Data confidence") {
          entry[label] = confidenceValue;
        } else {
          const trend = disease.trend_signal?.toLowerCase() ?? "stable";
          const value = trend.includes("increase")
            ? 90
            : trend.includes("decre")
            ? 40
            : 65;
          entry[label] = value;
        }
      });
      return entry;
    });
  }, [diseaseCards, overall?.data_quality_score]);

  const whatIfScore = useMemo(() => {
    const baseScore = overall?.risk_score ?? 0.5;
    const sleepDelta = (7 - whatIfValues.sleep) * 0.02;
    const activityDelta = (4 - whatIfValues.activity) * 0.025;
    const stressDelta = (whatIfValues.stress - 5) * 0.03;
    const adjusted = Math.min(
      Math.max(baseScore - sleepDelta - activityDelta - stressDelta, 0),
      1
    );
    return adjusted;
  }, [overall?.risk_score, whatIfValues]);
  const whatIfDelta = Math.round(
    (whatIfScore - (overall?.risk_score ?? 0)) * 100
  );

  const explanationText = useMemo(() => {
    const drivers = riskFactors.map((factor) =>
      formatFactorName(factor.factor_name)
    );
    if (!drivers.length) return "No drivers reported for this disease.";
    if (drivers.length === 1) {
      return `Your risk is primarily rising due to ${drivers[0]}.`;
    }
    if (drivers.length === 2) {
      return `Your risk is primarily rising due to ${drivers[0]} and ${drivers[1]}.`;
    }
    return `Your risk is primarily rising due to ${drivers
      .slice(0, 2)
      .join(", ")} and ${drivers[2]}.`;
  }, [riskFactors]);


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

  const handleExportPdf = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  const handleWhatIfChange =
    (field: "sleep" | "activity" | "stress") =>
    (_: Event, value: number | number[]) => {
      const numericValue = Array.isArray(value) ? value[0] : value;
      setWhatIfValues((prev) => ({ ...prev, [field]: numericValue }));
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
                    borderRadius: 1,
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
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    Patient-focused response
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    Command Center / Results
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate("/intake/demographics")}
                  sx={{ borderRadius: 100 }}
                >
                  Back to intake
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportPdf}
                  sx={{ textTransform: "none", fontWeight: 600, borderRadius: 100 }}
                >
                  Exportar PDF
                </Button>
              </Stack>
            </Stack>
            <Box sx={dashboardGridSx}>
              {/* Row 1 · Predictive summary spans 6/12 (~50%) */}
              <Card elevation={0} sx={cardPlacementSx(6, 1)}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                      Predictive summary
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
                          label={overall?.risk_level || "Unknown"}
                          color={trendIncreasing ? "error" : "success"}
                          sx={{ fontWeight: 600 }}
                        />
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <TrendingUpIcon
                            color={trendIncreasing ? "error" : "success"}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {trendSignal || "No longitudinal trend"}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Normalized 0-1
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentScore}
                        color={trendIncreasing ? "error" : "success"}
                        sx={{ mt: 1, height: 10, borderRadius: 999 }}
                      />
                    </Box>
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={3}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Highest risk disease
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {formatDiseaseName(overall?.highest_risk_disease)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Data quality confidence
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                          {Math.round(
                            (overall?.data_quality_score ?? 0) * 100
                          )}
                          %
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
              {/* Row 1 · Risk gauge spans 6/12 (~50%) */}
              <Card elevation={0} sx={cardPlacementSx(6, 1)}>
                <CardContent>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Risk gauge
                  </Typography>
                  <Box sx={{ height: 280, mt: 1 }}>
                    <RiskGauge score={overall?.risk_score} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Normalized score to size the probability.
                  </Typography>
                </CardContent>
              </Card>

              {/* Row 2 · Disease risk cards span full width */}
              <Box
                sx={{
                  ...gridColumnSpan(12),
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                  Disease risk cards
                </Typography>
                <Grid container spacing={2} mt={1}>
                  {diseaseCards.map((disease) => {
                    const probabilityPercent = Math.round(
                      (disease.risk_probability ?? 0) * 100
                  );
                  const diseaseTrend = disease.trend_signal || "stable";
                  const isIncreasing = diseaseTrend
                    .toLowerCase()
                    .includes("increase");
                  const TrendIconCmp = isIncreasing
                    ? TrendingUpIcon
                    : TrendingDownIcon;
                  return (
                    <Grid item xs={12} key={disease.disease}>
                      <Card elevation={0} sx={panelCardSx}>
                        <CardContent>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="h6" fontWeight={600}>
                              {formatDiseaseName(disease.disease)}
                            </Typography>
                            <Chip
                              size="small"
                              label={
                                disease.is_high_risk ? "High risk" : "Monitor"
                              }
                              color={disease.is_high_risk ? "error" : "default"}
                            />
                          </Stack>
                          <Typography variant="h4" fontWeight={700}>
                            {probabilityPercent}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Level: {disease.risk_level || "N/A"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Threshold {disease.threshold_used}
                          </Typography>
                          <Divider sx={{ my: 2 }} />
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <TrendIconCmp
                              fontSize="small"
                              color={isIncreasing ? "error" : "success"}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {diseaseTrend || "stable"}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
                {!diseaseCards.length && (
                  <Grid item xs={12}>
                    <Card elevation={0} sx={panelCardSx}>
                      <CardContent>
                        <Typography color="text.secondary">
                          No disease-specific predictions available.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Box>

              {/* Row 3 · Risk radar spans 4/12 (~33%) */}
              <Card elevation={0} sx={{ ...panelCardSx, ...gridColumnSpan(7, 1) }}>
                <CardContent>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Risk radar
                  </Typography>
                  <Box
                    sx={{
                      height: 320,
                      mt: 1,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      px: 1,
                    }}
                  >
                    {radarData.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart
                          data={radarData}
                          cx="50%"
                          cy="50%"
                          outerRadius="80%"
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="metric" />
                          <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tickCount={4}
                          />
                          {diseaseCards.slice(0, 4).map((disease, idx) => {
                            const label = formatDiseaseName(disease.disease);
                            return (
                              <Radar
                                key={`radar-${label}`}
                                name={label}
                                dataKey={label}
                                stroke={radarColors[idx % radarColors.length]}
                                fill={radarColors[idx % radarColors.length]}
                                fillOpacity={0.25}
                              />
                            );
                          })}
                        </RadarChart>
                      </ResponsiveContainer>
                    ) : (
                      <Typography color="text.secondary">
                        Not enough disease data to render radar.
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Axes show probability, input confidence, and trend
                    direction.
                  </Typography>
                </CardContent>
              </Card>
              {/* Row 3 · What-if simulator spans 4/12 (~34%) */}
              <Card elevation={0} sx={cardPlacementSx(5, 1)}>
                <CardContent>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    What-if simulator
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Adjust lifestyle levers to preview how risk could shift.
                  </Typography>
                  <Stack spacing={2.5} mt={3}>
                    <Box>
                      <Typography fontWeight={600}>Average sleep hours</Typography>
                      <Slider
                        value={whatIfValues.sleep}
                        onChange={handleWhatIfChange("sleep")}
                        step={0.5}
                        min={4}
                        max={9}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <Box>
                      <Typography fontWeight={600}>
                        Activity days / week
                      </Typography>
                      <Slider
                        value={whatIfValues.activity}
                        onChange={handleWhatIfChange("activity")}
                        step={1}
                        min={0}
                        max={7}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    <Box>
                      <Typography fontWeight={600}>Stress score</Typography>
                      <Slider
                        value={whatIfValues.stress}
                        onChange={handleWhatIfChange("stress")}
                        step={1}
                        min={1}
                        max={10}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </Stack>
                  <Stack
                    direction="row"
                    spacing={3}
                    mt={3}
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Projected risk
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {Math.round(whatIfScore * 100)}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Delta vs. current
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {whatIfDelta > 0
                          ? `+${whatIfDelta}%`
                          : `${whatIfDelta}%`}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Row 4 · Disease explainability spans 7/12 (~60%) */}
              <Card elevation={0} sx={cardPlacementSx(7)}>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                      Disease explainability
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {formatDiseaseName(primaryDisease?.disease)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {explanationText}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Top risk factors
                        </Typography>
                        <Stack spacing={1.5} mt={1}>
                          {riskFactors.length ? (
                            riskFactors.map((factor) => (
                              <Box key={`risk-${factor.factor_name}`}>
                                <Typography fontWeight={600}>
                                  {formatFactorName(factor.factor_name)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Value: {factor.user_value} · Impact{" "}
                                  {Math.round((factor.impact ?? 0) * 100)}%
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Direction: {factor.direction}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              No risk factors reported.
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="caption" color="text.secondary">
                          Protective factors
                        </Typography>
                        <Stack spacing={1.5} mt={1}>
                          {protectiveFactors.length ? (
                            protectiveFactors.map((factor) => (
                              <Box key={`protect-${factor.factor_name}`}>
                                <Typography fontWeight={600}>
                                  {formatFactorName(factor.factor_name)}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Value: {factor.user_value} · Impact{" "}
                                  {Math.round((factor.impact ?? 0) * 100)}%
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Direction: {factor.direction}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              No protective levers reported.
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>
              {/* Row 4 · Data quality spans 5/12 (~40%) */}
              <Card elevation={0} sx={cardPlacementSx(5)}>
                <CardContent>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Data quality & alerts
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Missing fields
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {dataQuality?.missing_fields?.length
                          ? dataQuality.missing_fields.join(", ")
                          : "None"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Inconsistent fields
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {dataQuality?.inconsistent_fields?.length
                          ? dataQuality.inconsistent_fields.join(", ")
                          : "None"}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Confidence note
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {dataQuality?.confidence_note || "No note provided."}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Row 5 · Fairness metrics spans 6/12 (~50%) */}
              <Card elevation={0} sx={cardPlacementSx(6, 1)}>
                <CardContent>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Fairness & transparency
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    {fairnessMetrics.map((metric) => (
                      <Box key={metric.label}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography fontWeight={600}>{metric.label}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {Math.round(metric.score * 100)}%
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={metric.score * 100}
                          sx={{ mt: 1, borderRadius: 999 }}
                          color={
                            metric.score > 0.9
                              ? "success"
                              : metric.score > 0.8
                              ? "warning"
                              : "error"
                          }
                        />
                        <Typography variant="caption" color="text.secondary">
                          {metric.note}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
              {/* Row 5 · Vital signals spans 6/12 (~50%) */}
              <Card elevation={0} sx={cardPlacementSx(6, 1)}>
                <CardContent>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Vital signals
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Highest risk disease
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatDiseaseName(overall?.highest_risk_disease)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Data quality score
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {Math.round((overall?.data_quality_score ?? 0) * 100)}%
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Missing fields
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {dataQuality?.missing_fields?.length
                          ? dataQuality.missing_fields.join(", ")
                          : "None"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
              {/* Row 6 · Actionable recommendations span full width */}
              <Card elevation={0} sx={cardPlacementSx(12)}>
                <CardContent>
                  <Typography variant="overline" sx={{ letterSpacing: 2 }}>
                    Actionable recommendations
                  </Typography>
                  <Stack spacing={2.5} mt={2}>
                    {recommendedActions.map((action, index) => {
                      const linkedFactor =
                        riskFactors.length > 0
                          ? riskFactors[index % riskFactors.length]
                          : undefined;
                      return (
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
                              Follow up with care team for scheduling.
                            </Typography>
                            {linkedFactor && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Linked factor:{" "}
                                {formatFactorName(linkedFactor.factor_name)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                  {result.disclaimer && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      mt={3}
                      display="block"
                    >
                      {result.disclaimer}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          </Stack>
        </Container>
      </Box>
      <Grow
        in={showScrollTop}
        timeout={{ enter: 260, exit: 200 }}
        unmountOnExit
      >
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
            transition:
              "transform 240ms cubic-bezier(0.4,0,0.2,1), box-shadow 200ms ease",
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
