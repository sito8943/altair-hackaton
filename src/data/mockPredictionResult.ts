import type { PredictionResult } from "../types";

const mockPredictionResult: PredictionResult = {
  overall: {
    risk_score: 0.61,
    risk_level: "High",
    highest_risk_disease: "hypertension",
    data_quality_score: 0.82,
  },
  disease_risks: [
    {
      disease: "hypertension",
      risk_probability: 0.74,
      risk_level: "High",
      threshold_used: 0.0055,
      is_high_risk: true,
      trend_signal: "increasing",
      explanation: {
        top_risk_factors: [
          {
            factor_name: "bmi_prev",
            user_value: 33.1,
            impact: 0.18,
            direction: "up",
          },
          {
            factor_name: "other_disease_count_prev",
            user_value: 2,
            impact: 0.13,
            direction: "up",
          },
        ],
        top_protective_factors: [
          {
            factor_name: "walks_prev",
            user_value: 1,
            impact: 0.05,
            direction: "down",
          },
        ],
      },
    },
  ],
  data_quality: {
    missing_fields: ["alcohol_frequency"],
    inconsistent_fields: [],
    confidence_note: "Good quality input",
  },
  recommendations: [
    "Increase weekly physical activity",
    "Improve sleep hygiene routine",
    "Monitor blood pressure daily",
  ],
  disclaimer: "Risk screening only, not a clinical diagnosis.",
};

export default mockPredictionResult;
