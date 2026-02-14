import { Box, Typography } from '@mui/material'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

interface RiskGaugeProps {
  score?: number
}

const zones = [
  { name: 'Low', value: 0.3, color: '#66bb6a' },
  { name: 'Moderate', value: 0.3, color: '#ffa726' },
  { name: 'High', value: 0.4, color: '#ef5350' },
]

const RiskGauge = ({ score = 0 }: RiskGaugeProps) => {
  const normalized = Math.min(Math.max(score, 0), 1)
  const percent = Math.round(normalized * 100)
  const fillColor = normalized < 0.3 ? '#66bb6a' : normalized < 0.6 ? '#ffa726' : '#ef5350'
  const valueData = [
    { name: 'value', value: normalized },
    { name: 'gap', value: 1 - normalized },
  ]

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={zones}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="80%"
            innerRadius={110}
            outerRadius={130}
            stroke="none"
          >
            {zones.map((zone) => (
              <Cell key={zone.name} fill={zone.color} />
            ))}
          </Pie>
          <Pie
            data={valueData}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            cx="50%"
            cy="80%"
            innerRadius={85}
            outerRadius={105}
            stroke="none"
          >
            <Cell key="value" fill={fillColor} />
            <Cell key="gap" fill="#e0e0e0" opacity={0.4} />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight={600}>
          {normalized.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {percent}% likelihood
        </Typography>
      </Box>
    </Box>
  )
}

export default RiskGauge
