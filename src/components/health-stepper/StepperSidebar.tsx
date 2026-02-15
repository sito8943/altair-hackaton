import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import type { StepDefinition } from "./types";
import StepDot from "./StepDot";

interface StepperSidebarProps {
  steps: StepDefinition[];
  activeStep: number;
}

const StepperSidebar = ({ steps, activeStep }: StepperSidebarProps) => (
  <Box
    className="hsf-stepper-panel"
    sx={{
      width: { xs: "100%", md: 280 },
      display: { xs: "none", md: "block" },
    }}
  >
    <Typography variant="overline" sx={{ letterSpacing: 2 }}>
      Intake Journey
    </Typography>
    <Typography variant="h6" mb={3} fontWeight={700}>
      Track your progress
    </Typography>
    <Stepper
      activeStep={activeStep}
      orientation="vertical"
      connector={null}
      className="hsf-stepper hsf-stepper--vertical"
    >
      {steps.map((step, index) => (
        <Step key={step.label} className="hsf-step">
          <StepLabel StepIconComponent={StepDot}>
            <Typography
              className="hsf-step-label"
              variant="body1"
              sx={{ fontSize: "14px" }}
              fontWeight={activeStep === index ? 700 : 500}
              color={activeStep === index ? "primary.main" : "text.secondary"}
            >
              {step.label}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  </Box>
);

export default StepperSidebar;
