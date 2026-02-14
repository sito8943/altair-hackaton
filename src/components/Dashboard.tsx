import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import type { ChipProps } from '@mui/material/Chip'
import FactorCard from './FactorCard'
import RiskGauge from './RiskGauge'
import type { PredictionResult } from '../types'

const riskChipColor = (level?: string | null): ChipProps['color'] => {
  if (!level) return 'default'
  const normalized = level.toLowerCase()
  if (normalized.includes('low')) return 'success'
  if (normalized.includes('moderate') || normalized.includes('medium')) return 'warning'
  return 'error'
}

interface DashboardProps {
  result: PredictionResult | null
}

const Dashboard = ({ result }: DashboardProps) => {
  if (!result) return null
  const { risk_score, risk_level, top_factors = [], trend_signal } = result
  const percentScore = Math.round((risk_score ?? 0) * 100)
  const trendIncreasing = (trend_signal || '').toLowerCase().includes('increase')
  const TrendIcon = trendIncreasing ? TrendingUpIcon : TrendingDownIcon

  return (
    <Box component="section" mt={6} mb={4}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Personalized Risk Intelligence
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Proactively monitor high-risk cohorts with explainable insights and longitudinal context.
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Main Risk Score
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={2} mt={1}>
                <Typography variant="h2" fontWeight={700}>
                  {percentScore}%
                </Typography>
                <Chip label={risk_level || 'Unknown'} color={riskChipColor(risk_level)} size="medium" />
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Represents likelihood of escalation within the next monitoring window.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Normalized Gauge (0-1)
              </Typography>
              <RiskGauge score={risk_score} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Top Contributing Factors
              </Typography>
              <Grid container spacing={2}>
                {top_factors.map((factor) => (
                  <Grid item xs={12} sm={6} key={`${factor.name}-${factor.impact}`}>
                    <FactorCard factor={factor} />
                  </Grid>
                ))}
                {!top_factors.length && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      No contributing factors returned by the service.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={0} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Trend Signal
              </Typography>
              <Stack direction="row" alignItems="center" spacing={2} mt={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: trendIncreasing ? 'rgba(239,83,80,0.12)' : 'rgba(102,187,106,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TrendIcon color={trendIncreasing ? 'error' : 'success'} fontSize="large" />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {trendIncreasing ? 'Rising risk' : 'Stabilizing'}
                </Typography>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                {trend_signal || 'No longitudinal trend available.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
