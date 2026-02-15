import type { HealthFormValues } from "../../types";
import StepDemographics from "../StepDemographics";
import StepVitals from "../StepVitals";
import StepLifestyle from "../StepLifestyle";
import type { StepDefinition } from "./types";

export const initialValues: HealthFormValues = {
  age: "",
  sex: "",
  education_level: "",
  employment_status: "",
  marital_status: "",
  bmi: "",
  systolic_bp: "",
  diastolic_bp: "",
  resting_heart_rate: "",
  chronic_conditions_count: "",
  recent_weight_change: "",
  physical_activity_days_per_week: "",
  sleep_hours_avg: "",
  smoking_status: "",
  alcohol_frequency: "",
  stress_level: 5,
  depressive_symptoms_score: "",
};

export const FORM_STORAGE_KEY = "health-risk-form-values";

export const routeMap = [
  "/intake/demographics",
  "/intake/vitals",
  "/intake/lifestyle",
];

export const steps: StepDefinition[] = [
  {
    label: "Demographics",
    component: StepDemographics,
    fields: [
      "age",
      "sex",
      "education_level",
      "employment_status",
      "marital_status",
    ],
  },
  {
    label: "Vitals & Physical",
    component: StepVitals,
    fields: [
      "bmi",
      "systolic_bp",
      "diastolic_bp",
      "resting_heart_rate",
      "chronic_conditions_count",
      "recent_weight_change",
    ],
  },
  {
    label: "Lifestyle & Mental Health",
    component: StepLifestyle,
    fields: [
      "physical_activity_days_per_week",
      "sleep_hours_avg",
      "smoking_status",
      "alcohol_frequency",
      "stress_level",
      "depressive_symptoms_score",
    ],
  },
];
