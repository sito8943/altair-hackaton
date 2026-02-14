import { Card, CardContent, Grid, MenuItem, TextField, Typography } from '@mui/material'

const StepDemographics = ({ values, onChange, errors }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <Card elevation={0} sx={{ borderRadius: 1 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Demographic Profile
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Capture the core demographics so we can contextualize physiologic and behavioral inputs.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Age"
              name="age"
              value={values.age}
              onChange={handleChange}
              error={Boolean(errors.age)}
              helperText={errors.age || 'Years, rounded to the nearest whole number'}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Sex"
              name="sex"
              value={values.sex}
              onChange={handleChange}
              error={Boolean(errors.sex)}
              helperText={errors.sex || 'Biologic sex as reported'}
            >
              {['Female', 'Male', 'Intersex / Other', 'Prefer not to say'].map((option) => (
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
              label="Education Level"
              name="education_level"
              value={values.education_level}
              onChange={handleChange}
              error={Boolean(errors.education_level)}
              helperText={errors.education_level || 'Highest completed tier'}
            >
              {['High school / GED', 'Associate degree', "Bachelor's", "Master's", 'Doctorate'].map((option) => (
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
              label="Employment Status"
              name="employment_status"
              value={values.employment_status}
              onChange={handleChange}
              error={Boolean(errors.employment_status)}
              helperText={errors.employment_status || 'Current role or designation'}
            >
              {['Employed', 'Self-employed', 'Unemployed', 'Retired', 'Student', 'Caregiver'].map((option) => (
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
              label="Marital Status"
              name="marital_status"
              value={values.marital_status}
              onChange={handleChange}
              error={Boolean(errors.marital_status)}
              helperText={errors.marital_status || 'Household / relationship status'}
            >
              {['Single', 'Married', 'Partnered', 'Divorced', 'Widowed'].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StepDemographics
