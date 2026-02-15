import { Box } from "@mui/material";
import type { StepIconProps } from "@mui/material/StepIcon";
import { brandColors } from "../../theme";

const StepDot = ({ active, completed, className, icon }: StepIconProps) => (
  <Box
    component="span"
    className={className}
    sx={{
      width: 28,
      height: 28,
      borderRadius: "50%",
      border: `2px solid ${brandColors.primary}`,
      backgroundColor:
        active || completed ? brandColors.primary : "transparent",
      transition: "all 0.3s ease",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: active || completed ? "#fff" : brandColors.primary,
      fontSize: 10,
      fontWeight: 600,
    }}
  >
    {typeof icon === "number" || typeof icon === "string" ? icon : null}
  </Box>
);

export default StepDot;
