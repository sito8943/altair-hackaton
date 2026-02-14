import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import type { ChangeEvent } from "react";
import type { HealthFormField, StepComponentProps } from "../types";
import { formFieldStyles, glassPanelCardSx } from "../theme";

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const weightChangeOptions = [
  "Stable (<2kg)",
  "Gained 2-5kg",
  "Gained >5kg",
  "Lost 2-5kg",
  "Lost >5kg",
];

const StepVitals = ({ values, onChange, errors }: StepComponentProps) => {
  const handleChange = (event: FieldEvent) => {
    const { name, value } = event.target;
    onChange(name as HealthFormField, value);
  };

  return (
    <Card
      elevation={0}
      sx={glassPanelCardSx}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Vital &amp; Physical Metrics
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Track the latest biometric baseline to calibrate the longitudinal
          model.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 4,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          <TextField
            fullWidth
            type="number"
            label="BMI"
            name="bmi"
            value={values.bmi}
            onChange={handleChange}
            error={Boolean(errors.bmi)}
            helperText={errors.bmi || "Body Mass Index"}
            InputProps={{ inputProps: { min: 0, step: 0.1 } }}
            sx={formFieldStyles}
          />
          <TextField
            fullWidth
            type="number"
            label="Systolic BP"
            name="systolic_bp"
            value={values.systolic_bp}
            onChange={handleChange}
            error={Boolean(errors.systolic_bp)}
            helperText={errors.systolic_bp || "mmHg"}
            InputProps={{ inputProps: { min: 50, max: 260 } }}
            sx={formFieldStyles}
          />
          <TextField
            fullWidth
            type="number"
            label="Diastolic BP"
            name="diastolic_bp"
            value={values.diastolic_bp}
            onChange={handleChange}
            error={Boolean(errors.diastolic_bp)}
            helperText={errors.diastolic_bp || "mmHg"}
            InputProps={{ inputProps: { min: 30, max: 180 } }}
            sx={formFieldStyles}
          />
          <TextField
            fullWidth
            type="number"
            label="Resting Heart Rate"
            name="resting_heart_rate"
            value={values.resting_heart_rate}
            onChange={handleChange}
            error={Boolean(errors.resting_heart_rate)}
            helperText={errors.resting_heart_rate || "Beats per minute"}
            InputProps={{ inputProps: { min: 30, max: 180 } }}
            sx={formFieldStyles}
          />
          <TextField
            fullWidth
            type="number"
            label="Chronic Conditions"
            name="chronic_conditions_count"
            value={values.chronic_conditions_count}
            onChange={handleChange}
            error={Boolean(errors.chronic_conditions_count)}
            helperText={
              errors.chronic_conditions_count ||
              "Count of conditions being managed"
            }
            InputProps={{ inputProps: { min: 0, max: 20 } }}
            sx={formFieldStyles}
          />
          <Box
            sx={{ gridColumn: { xs: "span 1", sm: "span 2", md: "span 3" } }}
          >
            <Autocomplete
              fullWidth
              options={weightChangeOptions}
              value={values.recent_weight_change || null}
              onChange={(_, newValue) =>
                onChange("recent_weight_change", newValue ?? "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Recent Weight Change"
                  error={Boolean(errors.recent_weight_change)}
                  helperText={errors.recent_weight_change || "Prior 3 months"}
                  sx={formFieldStyles}
                />
              )}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepVitals;
