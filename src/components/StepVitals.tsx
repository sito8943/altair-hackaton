import {
  Box,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { ChangeEvent } from "react";
import type { HealthFormField, StepComponentProps } from "../types";
import { formFieldStyles, glassPanelCardSx } from "../theme";

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const StepVitals = ({ values, onChange, errors }: StepComponentProps) => {
  const handleChange = (event: FieldEvent) => {
    const { name, value } = event.target;
    onChange(name as HealthFormField, value);
  };

  return (
    <Card elevation={0} sx={glassPanelCardSx}>
      <CardContent sx={{ p: 0 }}>
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
            placeholder="22.5"
            name="bmi"
            value={values.bmi}
            onChange={handleChange}
            error={Boolean(errors.bmi)}
            helperText={errors.bmi || "Body Mass Index"}
            InputProps={{ inputProps: { min: 0, step: 0.1 } }}
            sx={formFieldStyles}
          />
          <Box sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <TextField
                fullWidth
                type="number"
                label="Systolic (mmHg)"
                placeholder="120"
                name="systolic_bp"
                value={values.systolic_bp}
                onChange={handleChange}
                error={Boolean(errors.systolic_bp)}
                helperText={errors.systolic_bp}
                InputProps={{ inputProps: { min: 50, max: 260 } }}
                sx={formFieldStyles}
              />
              <TextField
                fullWidth
                type="number"
                label="Diastolic (mmHg)"
                placeholder="80"
                name="diastolic_bp"
                value={values.diastolic_bp}
                onChange={handleChange}
                error={Boolean(errors.diastolic_bp)}
                helperText={errors.diastolic_bp}
                InputProps={{ inputProps: { min: 30, max: 180 } }}
                sx={formFieldStyles}
              />
            </Stack>
          </Box>
          <TextField
            fullWidth
            type="number"
            label="Resting Heart Rate"
            placeholder="72"
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
            placeholder="0"
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
          <TextField
            fullWidth
            type="number"
            label="Recent Weight Change"
            placeholder="-1.5"
            name="recent_weight_change"
            value={values.recent_weight_change}
            onChange={handleChange}
            error={Boolean(errors.recent_weight_change)}
            helperText={errors.recent_weight_change || "Prior 3 months (kg)"}
            InputProps={{ inputProps: { step: 0.1 } }}
            sx={formFieldStyles}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepVitals;
