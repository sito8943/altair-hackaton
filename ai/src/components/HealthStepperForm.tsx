import { useMemo, useState } from "react";
import type { ComponentType, FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";
import StepDemographics from "./StepDemographics";
import StepVitals from "./StepVitals";
import StepLifestyle from "./StepLifestyle";
import type {
  HealthFormErrors,
  HealthFormField,
  HealthFormValues,
  PredictionPayload,
  StepComponentProps,
} from "../types";

interface StepDefinition {
  label: string;
  component: ComponentType<StepComponentProps>;
  fields: HealthFormField[];
}

interface HealthStepperFormProps {
  onSubmit: (payload: PredictionPayload) => void;
  loading: boolean;
}

const initialValues: HealthFormValues = {
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
  stress_level: 3,
  depressive_symptoms_score: "",
};

const steps: StepDefinition[] = [
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

const HealthStepperForm = ({ onSubmit, loading }: HealthStepperFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState<HealthFormValues>(initialValues);
  const [errors, setErrors] = useState<HealthFormErrors>({});
  const [formMessage, setFormMessage] = useState("");

  const CurrentStepComponent = useMemo<ComponentType<StepComponentProps>>(
    () => steps[activeStep].component,
    [activeStep]
  );

  const updateField = (field: HealthFormField, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateFields = (fields: HealthFormField[]) => {
    const validationErrors: HealthFormErrors = {};
    fields.forEach((field) => {
      const value = values[field];
      if (value === "" || value === null || value === undefined) {
        validationErrors[field] = "Required";
      }
    });
    if (Object.keys(validationErrors).length) {
      setErrors((prev) => ({ ...prev, ...validationErrors }));
    }
    return validationErrors;
  };

  const canAdvance = () => {
    const upcomingErrors = validateFields(steps[activeStep].fields);
    const hasErrors = Object.keys(upcomingErrors).length > 0;
    setFormMessage(
      hasErrors
        ? "Please complete the highlighted inputs before proceeding."
        : ""
    );
    return !hasErrors;
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setFormMessage("");
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setFormMessage("");
    setActiveStep(0);
  };

  const formatPayload = (): PredictionPayload => ({
    age: Number(values.age),
    sex: values.sex,
    education_level: values.education_level,
    employment_status: values.employment_status,
    marital_status: values.marital_status,
    bmi: Number(values.bmi),
    systolic_bp: Number(values.systolic_bp),
    diastolic_bp: Number(values.diastolic_bp),
    resting_heart_rate: Number(values.resting_heart_rate),
    chronic_conditions_count: Number(values.chronic_conditions_count),
    recent_weight_change: values.recent_weight_change,
    physical_activity_days_per_week: Number(
      values.physical_activity_days_per_week
    ),
    sleep_hours_avg: Number(values.sleep_hours_avg),
    smoking_status: values.smoking_status,
    alcohol_frequency: values.alcohol_frequency,
    stress_level: Number(values.stress_level),
    depressive_symptoms_score: Number(values.depressive_symptoms_score),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAdvance()) return;
    onSubmit(formatPayload());
  };

  return (
    <Box component="section" aria-label="Health data intake form">
      <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <CurrentStepComponent
          values={values}
          onChange={updateField}
          errors={errors}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mt={3}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Button
            variant="outlined"
            color="inherit"
            disabled={activeStep === 0 || loading}
            sx={{ px: 4 }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="text"
            color="inherit"
            disabled={loading}
            onClick={resetForm}
            sx={{ px: 4 }}
          >
            Reset
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            size="large"
            disableElevation
            disabled={loading}
            sx={{ px: 4 }}
            type={activeStep === steps.length - 1 ? "submit" : "button"}
            onClick={activeStep === steps.length - 1 ? undefined : handleNext}
          >
            {activeStep === steps.length - 1
              ? loading
                ? "Submitting..."
                : "Submit Assessment"
              : "Next"}
          </Button>
        </Stack>
        {formMessage && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {formMessage}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default HealthStepperForm;
