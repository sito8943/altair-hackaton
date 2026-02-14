import { useEffect, useMemo, useState } from "react";
import type { ComponentType, FormEvent } from "react";
import {
  Alert,
  Box,
  Fade,
  IconButton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import type { StepIconProps } from "@mui/material/StepIcon";
import StepDemographics from "./StepDemographics";
import StepVitals from "./StepVitals";
import StepLifestyle from "./StepLifestyle";
import { brandColors, brandGradients } from "../theme";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SendIcon from "@mui/icons-material/Send";
import "../styles/healthStepperAnimations.css";
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
  stress_level: 5,
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
      width: 8,
      height: 8,
      borderRadius: "50%",
      border: `2px solid ${brandColors.primary}`,
      backgroundColor:
        active || completed ? brandColors.primary : "transparent",
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
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        className="hsf-form"
      >
        {formMessage && (
          <Alert severity="warning" sx={{ mt: 2 }} className="hsf-alert">
            {formMessage}
          </Alert>
        )}
        <Fade key={activeStep} in timeout={500}>
          <Box className="hsf-step-panel">
            <CurrentStepComponent
              values={values}
              onChange={updateField}
              errors={errors}
            />
          </Box>
        </Fade>
        <Box mt={3}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            connector={null}
            sx={{
              justifyContent: "center",
              gap: 2,
            }}
            className="hsf-stepper"
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
                    transition: "transform 0.35s ease",
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
                    boxShadow: "none",
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
                className="hsf-step"
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Tooltip title="Back" placement="top">
            <span>
              <IconButton
                color="inherit"
                size="large"
                disabled={activeStep === 0 || loading}
                onClick={handleBack}
                className="hsf-icon-button"
              >
                <ArrowBackIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Reset" placement="top">
            <span>
              <IconButton
                color="inherit"
                size="large"
                disabled={loading}
                onClick={resetForm}
                className="hsf-icon-button"
              >
                <RestartAltIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Box sx={{ flexGrow: 1 }} />
          <Tooltip
            title={
              activeStep === steps.length - 1
                ? loading
                  ? "Submitting..."
                  : "Submit Assessment"
                : "Next"
            }
            placement="top"
          >
            <span>
              <IconButton
                color="primary"
                size="large"
                disabled={loading}
                type={activeStep === steps.length - 1 ? "submit" : "button"}
                onClick={
                  activeStep === steps.length - 1 ? undefined : handleNext
                }
                sx={{
                  bgcolor: "white",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "white" },
                }}
                className="hsf-icon-button hsf-icon-button--primary"
              >
                {activeStep === steps.length - 1 ? (
                  <SendIcon />
                ) : (
                  <ArrowForwardIcon />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
};

export default HealthStepperForm;
