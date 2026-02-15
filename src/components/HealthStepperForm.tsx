import { createRef, useEffect, useMemo, useState } from "react";
import type { ComponentType, FormEvent } from "react";
import { Alert, Box, Stack } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../styles/healthStepperAnimations.css";
import type {
  HealthFormErrors,
  HealthFormField,
  HealthFormValues,
  PredictionPayload,
  StepComponentProps,
} from "../types";
import {
  FORM_STORAGE_KEY,
  initialValues,
  routeMap,
  steps,
} from "./health-stepper/config";
import StepperSidebar from "./health-stepper/StepperSidebar";
import StepperMobile from "./health-stepper/StepperMobile";
import NavigationControls from "./health-stepper/NavigationControls";
import ResetButton from "./health-stepper/ResetButton";
import ResetConfirmationDialog from "./health-stepper/ResetConfirmationDialog";

interface HealthStepperFormProps {
  onSubmit: (payload: PredictionPayload) => void;
  loading: boolean;
  apiError?: string;
}

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

const HealthStepperForm = ({
  onSubmit,
  loading,
  apiError,
}: HealthStepperFormProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const derivedStep = routeMap.indexOf(location.pathname);
  const activeStep = derivedStep === -1 ? 0 : derivedStep;
  const [values, setValues] = useState<HealthFormValues>(() =>
    loadStoredValues()
  );
  const [errors, setErrors] = useState<HealthFormErrors>({});
  const [formMessage, setFormMessage] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

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
  const stepRefs = useMemo(
    () => steps.map(() => createRef<HTMLDivElement>()),
    []
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

  const handleResetClick = () => {
    setResetDialogOpen(true);
  };

  const resetFormState = () => {
    setValues(initialValues);
    setErrors({});
    setFormMessage("");
    navigate(routeMap[0]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(FORM_STORAGE_KEY);
    }
  };

  const handleResetConfirm = () => {
    setResetDialogOpen(false);
    resetFormState();
  };

  const handleResetCancel = () => {
    setResetDialogOpen(false);
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
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3, md: 5 }}
        alignItems="stretch"
      >
        <StepperSidebar steps={steps} activeStep={activeStep} />
        <Box className="hsf-form-container" sx={{ flex: 1, minWidth: 0 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            className="hsf-form"
          >
            {formMessage && (
              <Alert severity="warning" className="hsf-alert" sx={{ mb: 2 }}>
                {formMessage}
              </Alert>
            )}
            {apiError && (
              <Alert severity="error" className="hsf-alert" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            )}
            <Box className="hsf-form-panel">
              <Box className="hsf-reset-wrapper">
                <ResetButton disabled={loading} onClick={handleResetClick} />
              </Box>
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={activeStep}
                  timeout={{ enter: 520, exit: 420 }}
                  classNames="hsf-step-panel-transition"
                  nodeRef={stepRefs[activeStep]}
                  mountOnEnter
                  unmountOnExit
                >
                  <Box ref={stepRefs[activeStep]} className="hsf-step-panel">
                    <CurrentStepComponent
                      values={values}
                      onChange={updateField}
                      errors={errors}
                    />
                  </Box>
                </CSSTransition>
              </SwitchTransition>
            </Box>
            <StepperMobile steps={steps} activeStep={activeStep} />
            <NavigationControls
              activeStep={activeStep}
              isLastStep={activeStep === steps.length - 1}
              loading={loading}
              onBack={handleBack}
              onNext={handleNext}
            />
          </Box>
        </Box>
      </Stack>
      <ResetConfirmationDialog
        open={resetDialogOpen}
        onCancel={handleResetCancel}
        onConfirm={handleResetConfirm}
      />
    </Box>
  );
};

export default HealthStepperForm;
