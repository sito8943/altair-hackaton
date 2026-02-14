export interface PredictionFactor {
  name: string
  impact: number
}

export interface RiskFactorDetail {
  factor_name: string
  user_value: number | string
  impact: number
  direction: string
}

export interface DiseaseRiskExplanation {
  top_risk_factors?: RiskFactorDetail[]
  top_protective_factors?: RiskFactorDetail[]
}

export interface DiseaseRisk {
  disease: string
  risk_probability: number
  risk_level: string
  threshold_used: number
  is_high_risk: boolean
  trend_signal?: string
  explanation?: DiseaseRiskExplanation
}

export interface PredictionResult {
  overall: {
    risk_score: number
    risk_level: string
    highest_risk_disease: string
    data_quality_score: number
  }
  disease_risks: DiseaseRisk[]
  data_quality: {
    missing_fields: string[]
    inconsistent_fields: string[]
    confidence_note: string
  }
  recommendations: string[]
  disclaimer: string
}

export interface HealthFormValues {
  age: string
  sex: string
  education_level: string
  employment_status: string
  marital_status: string
  bmi: string
  systolic_bp: string
  diastolic_bp: string
  resting_heart_rate: string
  chronic_conditions_count: string
  recent_weight_change: string
  physical_activity_days_per_week: string
  sleep_hours_avg: string
  smoking_status: string
  alcohol_frequency: string
  stress_level: number
  depressive_symptoms_score: string
}

export type HealthFormField = keyof HealthFormValues

export type HealthFormErrors = Partial<Record<HealthFormField, string>>

export interface PredictionPayload {
  age: number
  sex: string
  education_level: string
  employment_status: string
  marital_status: string
  bmi: number
  systolic_bp: number
  diastolic_bp: number
  resting_heart_rate: number
  chronic_conditions_count: number
  recent_weight_change: string
  physical_activity_days_per_week: number
  sleep_hours_avg: number
  smoking_status: string
  alcohol_frequency: string
  stress_level: number
  depressive_symptoms_score: number
}

export interface StepComponentProps {
  values: HealthFormValues
  onChange: (field: HealthFormField, value: string | number) => void
  errors: HealthFormErrors
}
