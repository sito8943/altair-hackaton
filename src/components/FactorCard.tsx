import { Card, CardContent, LinearProgress, Typography } from '@mui/material'
import type { PredictionFactor } from '../types'

interface FactorCardProps {
  factor: PredictionFactor
}

const FactorCard = ({ factor }: FactorCardProps) => {
  if (!factor) return null
  const impactPercent = Math.round((factor.impact ?? 0) * 100)

  return (
    <Card elevation={0} sx={{ borderRadius: 1, height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          {factor.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" mb={2}>
          Impact: {impactPercent}% of total score
        </Typography>
        <LinearProgress
          variant="determinate"
          value={impactPercent}
          color={impactPercent > 60 ? 'error' : impactPercent > 30 ? 'warning' : 'success'}
          sx={{ height: 8, borderRadius: 5 }}
        />
        <Typography variant="body2" color="text.secondary" mt={2}>
          {factor.name} currently exerts a {impactPercent}% contribution—addressing this lever can modulate risk rapidly.
        </Typography>
      </CardContent>
    </Card>
  )
}

export default FactorCard
