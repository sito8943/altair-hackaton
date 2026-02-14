import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { ChangeEvent } from "react";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import type { HealthFormField, StepComponentProps } from "../types";

const stressMarks = [
  { value: 1, label: "Calm" },
  { value: 3, label: "Baseline" },
  { value: 5, label: "Acute" },
];

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

const smokingOptions = ["Never", "Former", "Occasional", "Daily"];
const alcoholOptions = ["None", "Monthly", "Weekly", "Daily"];

const StepLifestyle = ({ values, onChange, errors }: StepComponentProps) => {
  const handleChange = (event: FieldEvent) => {
    const { name, value } = event.target;
    onChange(name as HealthFormField, value);
  };

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const resolvedValue = Array.isArray(newValue) ? newValue[0] : newValue;
    onChange("stress_level", resolvedValue);
  };

  return (
    <Card elevation={0} sx={{ borderRadius: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Lifestyle &amp; Mental Health
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Understand recovery capacity and mood dynamics to guide proactive
          outreach protocols.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gap: 2,
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
            label="Physical Activity (days/week)"
            name="physical_activity_days_per_week"
            value={values.physical_activity_days_per_week}
            onChange={handleChange}
            error={Boolean(errors.physical_activity_days_per_week)}
            helperText={
              errors.physical_activity_days_per_week ||
              "Moderate-to-vigorous days"
            }
            InputProps={{ inputProps: { min: 0, max: 7 } }}
          />
          <TextField
            fullWidth
            type="number"
            label="Avg Sleep (hours)"
            name="sleep_hours_avg"
            value={values.sleep_hours_avg}
            onChange={handleChange}
            error={Boolean(errors.sleep_hours_avg)}
            helperText={errors.sleep_hours_avg || "Past week average"}
            InputProps={{ inputProps: { min: 0, max: 14, step: 0.5 } }}
          />
          <Autocomplete
            options={smokingOptions}
            value={values.smoking_status || null}
            onChange={(_, newValue) =>
              onChange("smoking_status", newValue ?? "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Smoking Status"
                error={Boolean(errors.smoking_status)}
                helperText={errors.smoking_status || "Current tobacco exposure"}
              />
            )}
          />
          <Autocomplete
            options={alcoholOptions}
            value={values.alcohol_frequency || null}
            onChange={(_, newValue) =>
              onChange("alcohol_frequency", newValue ?? "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Alcohol Frequency"
                error={Boolean(errors.alcohol_frequency)}
                helperText={errors.alcohol_frequency || "Typical cadence"}
              />
            )}
          />
          <Box
            sx={{
              gridColumn: { xs: "span 1", sm: "span 2", md: "span 3" },
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Stress Level (1-5)
            </Typography>
            <Stack direction="row" gap={3}>
              <SentimentSatisfiedAltIcon />
              <Slider
                name="stress_level"
                value={values.stress_level}
                min={1}
                max={5}
                step={1}
                marks={stressMarks}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                color={
                  values.stress_level >= 4
                    ? "error"
                    : values.stress_level >= 3
                    ? "warning"
                    : "success"
                }
              />
              <SentimentVeryDissatisfiedIcon />
            </Stack>
            {errors.stress_level && (
              <Typography variant="caption" color="error">
                {errors.stress_level}
              </Typography>
            )}
          </Box>
          <TextField
            fullWidth
            type="number"
            label="Depressive Symptoms Score"
            name="depressive_symptoms_score"
            value={values.depressive_symptoms_score}
            onChange={handleChange}
            error={Boolean(errors.depressive_symptoms_score)}
            helperText={
              errors.depressive_symptoms_score ||
              "Validated screening (PHQ-9, DASS-21, etc.)"
            }
            InputProps={{ inputProps: { min: 0, max: 27 } }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepLifestyle;
