export interface PredictionFactor {
  name: string
  impact: number
}

export interface PredictionResult {
  risk_score: number
  risk_level: string
  top_factors: PredictionFactor[]
  trend_signal: string
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
