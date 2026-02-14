import type { PredictionResult } from "../types";

interface LegacyPredictionFactor {
  name: string;
  impact: number;
}

interface LegacyPredictionResult {
  risk_score?: number;
  risk_level?: string;
  top_factors?: LegacyPredictionFactor[];
  trend_signal?: string;
}

const hasNewShape = (payload: unknown): payload is PredictionResult =>
  Boolean(payload && typeof payload === "object" && "overall" in (payload as Record<string, unknown>));

const formatFactorName = (name: string) =>
  name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const normalizePredictionResult = (
  payload: PredictionResult | LegacyPredictionResult
): PredictionResult => {
  if (hasNewShape(payload)) {
    return payload;
  }

  const legacy = payload ?? {};
  const riskScore = legacy.risk_score ?? 0;
  const riskLevel = legacy.risk_level ?? "Unknown";
  const factors = legacy.top_factors ?? [];

  return {
    overall: {
      risk_score: riskScore,
      risk_level: riskLevel,
      highest_risk_disease: "hypertension",
      data_quality_score: 0.8,
    },
    disease_risks: [
      {
        disease: "hypertension",
        risk_probability: riskScore,
        risk_level: riskLevel,
        threshold_used: 0.005,
        is_high_risk: riskLevel.toLowerCase().includes("high"),
        trend_signal: legacy.trend_signal ?? "stable",
        explanation: {
          top_risk_factors: factors.map((factor) => ({
            factor_name: factor.name,
            user_value: formatFactorName(factor.name),
            impact: factor.impact ?? 0,
            direction: "up",
          })),
          top_protective_factors: [],
        },
      },
    ],
    data_quality: {
      missing_fields: [],
      inconsistent_fields: [],
      confidence_note: "Converted from legacy schema",
    },
    recommendations: [
      "Increase weekly physical activity",
      "Improve sleep hygiene routine",
      "Monitor blood pressure daily",
    ],
    disclaimer: "Risk screening only, not a clinical diagnosis.",
  };
};

export default normalizePredictionResult;
