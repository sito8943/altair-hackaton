import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SendIcon from "@mui/icons-material/Send";

interface NavigationControlsProps {
  activeStep: number;
  isLastStep: boolean;
  loading: boolean;
  onBack: () => void;
  onNext: () => void;
}

const NavigationControls = ({
  activeStep,
  isLastStep,
  loading,
  onBack,
  onNext,
}: NavigationControlsProps) => (
  <Stack
    direction={{ xs: "column", sm: "row" }}
    spacing={2}
    alignItems={{ xs: "stretch", sm: "center" }}
    justifyContent="space-between"
    sx={{ mt: { xs: 3, md: 3 } }}
  >
    <Tooltip title="Back" placement="top">
      <span>
        <IconButton
          color="inherit"
          size="large"
          disabled={activeStep === 0 || loading}
          onClick={onBack}
          className="hsf-icon-button"
        >
          <ArrowBackIcon />
        </IconButton>
      </span>
    </Tooltip>
    <Box sx={{ flexGrow: 1 }} />
    <Tooltip
      title={isLastStep ? (loading ? "Submitting..." : "Submit Assessment") : "Next"}
      placement="top"
    >
      <span>
        <IconButton
          color="primary"
          size="large"
          disabled={loading}
          type={isLastStep ? "submit" : "button"}
          onClick={isLastStep ? undefined : onNext}
          sx={{
            bgcolor: "white",
            boxShadow: "none",
            "&:hover": { bgcolor: "white" },
          }}
          className="hsf-icon-button hsf-icon-button--primary"
        >
          {isLastStep ? <SendIcon /> : <ArrowForwardIcon />}
        </IconButton>
      </span>
    </Tooltip>
  </Stack>
);

export default NavigationControls;
