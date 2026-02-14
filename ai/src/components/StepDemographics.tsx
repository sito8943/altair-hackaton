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

  const fieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      backgroundColor: "#fff",
      transition: "all 0.3s ease",
      "& fieldset": { borderColor: "#e4ecf7" },
      "&:hover fieldset": { borderColor: "#0f4c81" },
      "&.Mui-focused fieldset": {
        borderColor: "#0f4c81",
        boxShadow: "0 0 0 3px rgba(15,76,129,0.08)",
      },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 600,
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: '1px solid rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(14px)',
        boxShadow: '0 25px 60px rgba(9,29,66,0.12)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Demographic Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Capture the core demographics so we can contextualize physiologic and
          behavioral inputs.
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
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
              sx={fieldStyles}
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
                  sx={fieldStyles}
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
                  sx={fieldStyles}
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
                  sx={fieldStyles}
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
                  sx={fieldStyles}
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
