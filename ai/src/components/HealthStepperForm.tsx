import { useEffect, useMemo, useState } from "react";
import type { ComponentType, FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Fade,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import type { StepIconProps } from "@mui/material/StepIcon";
import StepDemographics from "./StepDemographics";
import StepVitals from "./StepVitals";
import StepLifestyle from "./StepLifestyle";
import { brandColors, brandGradients } from "../theme";
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

const FORM_STORAGE_KEY = "health-risk-form-values";

const loadStoredValues = (): HealthFormValues => {
  if (typeof window === "undefined") return initialValues;
  try {
    const raw = window.localStorage.getItem(FORM_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<HealthFormValues>;
      return { ...initialValues, ...parsed };
    }
  } catch (error) {
    console.warn("Unable to parse stored form values", error);
  }
  return initialValues;
};

const routeMap = [
  "/intake/demographics",
  "/intake/vitals",
  "/intake/lifestyle",
];

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

const StepDot = ({ active, completed, className }: StepIconProps) => (
  <Box
    component="span"
    className={className}
    sx={{
      width: 12,
      height: 12,
      borderRadius: "50%",
      border: `2px solid ${brandColors.primary}`,
      backgroundColor: active || completed
        ? brandColors.primary
        : "transparent",
      transition: "all 0.3s ease",
      display: "inline-flex",
    }}
  />
);

const HealthStepperForm = ({ onSubmit, loading }: HealthStepperFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const derivedStep = routeMap.indexOf(location.pathname);
  const activeStep = derivedStep === -1 ? 0 : derivedStep;
  const [values, setValues] = useState<HealthFormValues>(() =>
    loadStoredValues()
  );
  const [errors, setErrors] = useState<HealthFormErrors>({});
  const [formMessage, setFormMessage] = useState("");

  useEffect(() => {
    if (derivedStep === -1) {
      navigate(routeMap[0], { replace: true });
    }
  }, [derivedStep, navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(values));
  }, [values]);

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
    if (activeStep < steps.length - 1) {
      navigate(routeMap[activeStep + 1]);
    }
  };

  const handleBack = () => {
    setFormMessage("");
    if (activeStep === 0) return;
    navigate(routeMap[activeStep - 1]);
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setFormMessage("");
    navigate(routeMap[0]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(FORM_STORAGE_KEY);
    }
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
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Fade key={activeStep} in timeout={500}>
          <Box>
            <CurrentStepComponent
              values={values}
              onChange={updateField}
              errors={errors}
            />
          </Box>
        </Fade>
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
            sx={{ px: 4, borderRadius: 100 }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            variant="text"
            color="inherit"
            disabled={loading}
            onClick={resetForm}
            sx={{ px: 4, borderRadius: 100 }}
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
            sx={{ px: 4, borderRadius: 100 }}
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
      <Box mt={3}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={null}
          sx={{ justifyContent: "center", gap: 2 }}
        >
          {steps.map((step, index) => (
            <Step
              key={step.label}
              sx={{
                flex: 0,
                px: 0,
                position: "relative",
                "& .MuiStepLabel-root": {
                  alignItems: "center",
                },
                "& .MuiStepIcon-root": {
                  transform: activeStep === index ? "scale(1.4)" : "scale(1)",
                },
                "&:hover .MuiStepIcon-root": {
                  transform: "scale(1.4)",
                },
                "& .step-label-text": {
                  opacity: 0,
                  transform: "translate(-50%, -2px) scale(0.92)",
                  transition: "opacity 0.25s ease, transform 0.25s ease",
                  pointerEvents: "none",
                  position: "absolute",
                  bottom: 42,
                  left: "50%",
                  zIndex: 2,
                  background: brandGradients.midnight,
                  color: "#fff",
                  padding: "10px 28px",
                  borderRadius: 14,
                  boxShadow: "0 16px 40px rgba(6,24,58,0.35)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  letterSpacing: 0.1,
                },
                "& .step-label-text::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -6,
                  left: "50%",
                  transform: "translateX(-50%)",
                  borderWidth: "6px 6px 0 6px",
                  borderStyle: "solid",
                  borderColor: `${brandColors.primary} transparent transparent transparent`,
                  opacity: 0,
                  transition: "opacity 0.25s ease",
                },
                "&:hover .step-label-text": {
                  opacity: 1,
                  transform: "translate(-50%, -18px) scale(1)",
                },
                "&:hover .step-label-text::after": {
                  opacity: 1,
                },
              }}
            >
              <StepLabel StepIconComponent={StepDot}>
                <Stack
                  className="step-label-text"
                  spacing={0.3}
                  alignItems="center"
                >
                  <Typography variant="caption" color="primary.text">
                    Step {index + 1}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    textAlign="center"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {step.label}
                  </Typography>
                </Stack>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
};

export default HealthStepperForm;
