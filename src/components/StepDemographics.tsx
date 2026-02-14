import {
  Autocomplete,
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

const sexOptions = ["Female", "Male", "Intersex / Other", "Prefer not to say"];
const educationOptions = [
  "High school / GED",
  "Associate degree",
  "Bachelor's",
  "Master's",
  "Doctorate",
];
const employmentOptions = [
  "Employed",
  "Self-employed",
  "Unemployed",
  "Retired",
  "Student",
  "Caregiver",
];
const maritalOptions = [
  "Single",
  "Married",
  "Partnered",
  "Divorced",
  "Widowed",
];

const StepDemographics = ({ values, onChange, errors }: StepComponentProps) => {
  const handleChange = (event: FieldEvent) => {
    const { name, value } = event.target;
    onChange(name as HealthFormField, value);
  };

  return (
    <Card elevation={0} sx={glassPanelCardSx}>
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Demographic Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Capture the core demographics so we can contextualize physiologic and
          behavioral inputs.
        </Typography>
        <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
          <Box sx={{ flex: "1 1 260px", minWidth: { xs: "100%", sm: 260 } }}>
            <TextField
              fullWidth
              type="number"
              label="Age"
              name="age"
              value={values.age}
              onChange={handleChange}
              error={Boolean(errors.age)}
              helperText={
                errors.age || "Years, rounded to the nearest whole number"
              }
              InputProps={{ inputProps: { min: 0 } }}
              sx={formFieldStyles}
            />
          </Box>
          <Box sx={{ flex: "1 1 260px", minWidth: { xs: "100%", sm: 260 } }}>
            <Autocomplete
              fullWidth
              options={sexOptions}
              value={values.sex || null}
              onChange={(_, newValue) => onChange("sex", newValue ?? "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sex"
                  error={Boolean(errors.sex)}
                  helperText={errors.sex || "Biologic sex as reported"}
                  sx={formFieldStyles}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: "1 1 260px", minWidth: { xs: "100%", sm: 260 } }}>
            <Autocomplete
              fullWidth
              options={educationOptions}
              value={values.education_level || null}
              onChange={(_, newValue) =>
                onChange("education_level", newValue ?? "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Education Level"
                  error={Boolean(errors.education_level)}
                  helperText={
                    errors.education_level || "Highest completed tier"
                  }
                  sx={formFieldStyles}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: "1 1 260px", minWidth: { xs: "100%", sm: 260 } }}>
            <Autocomplete
              fullWidth
              options={employmentOptions}
              value={values.employment_status || null}
              onChange={(_, newValue) =>
                onChange("employment_status", newValue ?? "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employment Status"
                  error={Boolean(errors.employment_status)}
                  helperText={
                    errors.employment_status || "Current role or designation"
                  }
                  sx={formFieldStyles}
                />
              )}
            />
          </Box>
          <Box sx={{ flex: "1 1 260px", minWidth: { xs: "100%", sm: 260 } }}>
            <Autocomplete
              fullWidth
              options={maritalOptions}
              value={values.marital_status || null}
              onChange={(_, newValue) =>
                onChange("marital_status", newValue ?? "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Marital Status"
                  error={Boolean(errors.marital_status)}
                  helperText={
                    errors.marital_status || "Household / relationship status"
                  }
                  sx={formFieldStyles}
                />
              )}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default StepDemographics;
