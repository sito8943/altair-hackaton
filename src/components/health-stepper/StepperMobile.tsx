import { Box, Stack, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { brandColors, brandGradients } from "../../theme";
import type { StepDefinition } from "./types";
import StepDot from "./StepDot";

interface StepperMobileProps {
  steps: StepDefinition[];
  activeStep: number;
}

const StepperMobile = ({ steps, activeStep }: StepperMobileProps) => (
  <Box mt={3} display={{ xs: "block", md: "none" }}>
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
            <Stack className="step-label-text" spacing={0.3} alignItems="center">
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
);

export default StepperMobile;
