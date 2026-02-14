import type { PredictionResult } from "../types";

const mockPredictionResult: PredictionResult = {
  overall: {
    risk_score: 0.61,
    risk_level: "High",
    highest_risk_disease: "hibpe",
    data_quality_score: 0.84,
  },
  disease_risks: [
    {
      disease: "hibpe",
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
          {
            factor_name: "sleep_hours_prev",
            user_value: 5.5,
            impact: 0.08,
            direction: "down",
          },
        ],
        top_protective_factors: [
          {
            factor_name: "walks_prev",
            user_value: 1,
            impact: 0.05,
            direction: "down",
          },
          {
            factor_name: "med_adherence_prev",
            user_value: 0.9,
            impact: 0.04,
            direction: "down",
          },
        ],
      },
    },
    {
      disease: "diabe",
      risk_probability: 0.58,
      risk_level: "Moderate",
      threshold_used: 0.004,
      is_high_risk: false,
      trend_signal: "stable",
      explanation: {
        top_risk_factors: [
          {
            factor_name: "a1c_prev",
            user_value: 6.7,
            impact: 0.16,
            direction: "up",
          },
          {
            factor_name: "waist_circ_prev",
            user_value: 104,
            impact: 0.11,
            direction: "up",
          },
          {
            factor_name: "sleep_hours_prev",
            user_value: 5.5,
            impact: 0.07,
            direction: "down",
          },
        ],
        top_protective_factors: [
          {
            factor_name: "steps_prev",
            user_value: 7500,
            impact: 0.06,
            direction: "down",
          },
        ],
      },
    },
    {
      disease: "hearte",
      risk_probability: 0.49,
      risk_level: "Moderate",
      threshold_used: 0.0045,
      is_high_risk: false,
      trend_signal: "decreasing",
      explanation: {
        top_risk_factors: [
          {
            factor_name: "bp_variability_prev",
            user_value: 15,
            impact: 0.14,
            direction: "up",
          },
          {
            factor_name: "stress_score_prev",
            user_value: 8,
            impact: 0.12,
            direction: "up",
          },
        ],
        top_protective_factors: [
          {
            factor_name: "meditation_sessions",
            user_value: 3,
            impact: 0.05,
            direction: "down",
          },
          {
            factor_name: "omega3_intake",
            user_value: 4,
            impact: 0.04,
            direction: "down",
          },
        ],
      },
    },
    {
      disease: "stroke",
      risk_probability: 0.37,
      risk_level: "Low",
      threshold_used: 0.0032,
      is_high_risk: false,
      trend_signal: "stable",
      explanation: {
        top_risk_factors: [
          {
            factor_name: "family_history_prev",
            user_value: 1,
            impact: 0.09,
            direction: "up",
          },
          {
            factor_name: "ldl_prev",
            user_value: 140,
            impact: 0.07,
            direction: "up",
          },
        ],
        top_protective_factors: [
          {
            factor_name: "statin_adherence",
            user_value: 0.95,
            impact: 0.05,
            direction: "down",
          },
        ],
      },
    },
    {
      disease: "arthre",
      risk_probability: 0.42,
      risk_level: "Moderate",
      threshold_used: 0.0038,
      is_high_risk: false,
      trend_signal: "increasing",
      explanation: {
        top_risk_factors: [
          {
            factor_name: "weight_gain_prev",
            user_value: 3.4,
            impact: 0.1,
            direction: "up",
          },
          {
            factor_name: "activity_days_prev",
            user_value: 1,
            impact: 0.08,
            direction: "down",
          },
        ],
        top_protective_factors: [
          {
            factor_name: "physical_therapy_sessions",
            user_value: 2,
            impact: 0.05,
            direction: "down",
          },
        ],
      },
    },
  ],
  data_quality: {
    missing_fields: ["drinkn_prev"],
    inconsistent_fields: ["sleep_hours_prev"],
    confidence_note: "Good quality input with minor gaps",
  },
  recommendations: [
    "Increase weekly physical activity",
    "Improve sleep hygiene routine",
    "Monitor blood pressure daily",
    "Schedule nutrition coaching",
  ],
  disclaimer: "Risk screening only, not a clinical diagnosis.",
};

export default mockPredictionResult;
