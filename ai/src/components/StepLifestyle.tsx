import { Card, CardContent, MenuItem, Slider, Stack, TextField, Typography } from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import type { SelectChangeEvent } from '@mui/material/Select'
import type { ChangeEvent } from 'react'
import type { HealthFormField, StepComponentProps } from '../types'

const stressMarks = [
  { value: 1, label: 'Calm' },
  { value: 3, label: 'Baseline' },
  { value: 5, label: 'Acute' },
]

type FieldEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>

const StepLifestyle = ({ values, onChange, errors }: StepComponentProps) => {
  const handleChange = (event: FieldEvent) => {
    const { name, value } = event.target
    onChange(name as HealthFormField, value)
  }

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const resolvedValue = Array.isArray(newValue) ? newValue[0] : newValue
    onChange('stress_level', resolvedValue)
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Lifestyle &amp; Mental Health
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Understand recovery capacity and mood dynamics to guide proactive outreach protocols.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Physical Activity (days/week)"
              name="physical_activity_days_per_week"
              value={values.physical_activity_days_per_week}
              onChange={handleChange}
              error={Boolean(errors.physical_activity_days_per_week)}
              helperText={
                errors.physical_activity_days_per_week || 'Moderate-to-vigorous days'
              }
              InputProps={{ inputProps: { min: 0, max: 7 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Avg Sleep (hours)"
              name="sleep_hours_avg"
              value={values.sleep_hours_avg}
              onChange={handleChange}
              error={Boolean(errors.sleep_hours_avg)}
              helperText={errors.sleep_hours_avg || 'Past week average'}
              InputProps={{ inputProps: { min: 0, max: 14, step: 0.5 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Smoking Status"
              name="smoking_status"
              value={values.smoking_status}
              onChange={handleChange}
              error={Boolean(errors.smoking_status)}
              helperText={errors.smoking_status || 'Current tobacco exposure'}
            >
              {['Never', 'Former', 'Occasional', 'Daily'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Alcohol Frequency"
              name="alcohol_frequency"
              value={values.alcohol_frequency}
              onChange={handleChange}
              error={Boolean(errors.alcohol_frequency)}
              helperText={errors.alcohol_frequency || 'Typical cadence'}
            >
              {['None', 'Monthly', 'Weekly', 'Daily'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack spacing={1} sx={{ px: { xs: 1, md: 3 } }}>
              <Typography variant="subtitle2" color="text.secondary">
                Stress Level (1-5)
              </Typography>
              <Slider
                name="stress_level"
                value={values.stress_level}
                min={1}
                max={5}
                step={1}
                marks={stressMarks}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                color={values.stress_level >= 4 ? 'error' : values.stress_level >= 3 ? 'warning' : 'success'}
              />
              {errors.stress_level && (
                <Typography variant="caption" color="error">
                  {errors.stress_level}
                </Typography>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Depressive Symptoms Score"
              name="depressive_symptoms_score"
              value={values.depressive_symptoms_score}
              onChange={handleChange}
              error={Boolean(errors.depressive_symptoms_score)}
              helperText={
                errors.depressive_symptoms_score || 'Validated screening (PHQ-9, DASS-21, etc.)'
              }
              InputProps={{ inputProps: { min: 0, max: 27 } }}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StepLifestyle
