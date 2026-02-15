import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { IconButton, Tooltip } from "@mui/material";

interface ResetButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

const ResetButton = ({ disabled, onClick }: ResetButtonProps) => (
  <Tooltip title="Reset" placement="top">
    <span>
      <IconButton
        color="inherit"
        size="large"
        disabled={disabled}
        onClick={onClick}
        className="hsf-icon-button"
      >
        <RestartAltIcon />
      </IconButton>
    </span>
  </Tooltip>
);

export default ResetButton;
