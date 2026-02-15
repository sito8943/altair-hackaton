import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import { Box, Card, CardContent, Chip, Divider, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/GridLegacy'
import type { ChipProps } from '@mui/material/Chip'
import FactorCard from './FactorCard'
import RiskGauge from './RiskGauge'
import type { PredictionFactor, PredictionResult } from '../types'

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

const formatFactorName = (name: string) =>
  name
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const Dashboard = ({ result }: DashboardProps) => {
  if (!result) return null
  const overall = result.overall
  const primaryDisease = result.disease_risks?.[0]
  const percentScore = Math.round((overall?.risk_score ?? 0) * 100)
  const trendText = primaryDisease?.trend_signal || ''
  const trendIncreasing = trendText.toLowerCase().includes('increase')
  const TrendIcon = trendIncreasing ? TrendingUpIcon : TrendingDownIcon
  const topFactors: PredictionFactor[] =
    primaryDisease?.explanation?.top_risk_factors?.map((factor) => ({
      name: formatFactorName(factor.factor_name),
      impact: factor.impact,
    })) ?? []

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
          <Card elevation={0} sx={{ borderRadius: 1, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Main Risk Score
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={2} mt={1}>
                <Typography variant="h2" fontWeight={700}>
                  {percentScore}%
                </Typography>
                <Chip label={overall?.risk_level || 'Unknown'} color={riskChipColor(overall?.risk_level)} size="medium" />
              </Stack>
              <Typography variant="body2" color="text.secondary" mt={2}>
                Highest risk disease: {overall?.highest_risk_disease || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ borderRadius: 1, height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Normalized Gauge (0-1)
              </Typography>
              <RiskGauge score={overall?.risk_score} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card elevation={0} sx={{ borderRadius: 1 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Top Contributing Factors
              </Typography>
              <Grid container spacing={2}>
                {topFactors.map((factor) => (
                  <Grid item xs={12} sm={6} key={`${factor.name}-${factor.impact}`}>
                    <FactorCard factor={factor} />
                  </Grid>
                ))}
                {!topFactors.length && (
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
          <Card elevation={0} sx={{ borderRadius: 1, height: '100%' }}>
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
                {trendText || 'No longitudinal trend available.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
