import type { PredictionResult } from "../types";

const mockPredictionResult: PredictionResult = {
  risk_score: 0.67,
  risk_level: "High",
  trend_signal: "Risk increasing compared to last 14 days",
  top_factors: [
    { name: "Elevated blood pressure variability", impact: 0.35 },
    { name: "Sleep debt > 2 hours", impact: 0.22 },
    { name: "Low activity adherence", impact: 0.18 },
    { name: "Psychological stress marker", impact: 0.13 },
  ],
};

export default mockPredictionResult;
