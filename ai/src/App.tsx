import { useState } from 'react'
import {
  Alert,
  Box,
  Container,
  CssBaseline,
  Fade,
  LinearProgress,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import Dashboard from './components/Dashboard'
import HealthStepperForm from './components/HealthStepperForm'
import { predictRisk } from './services/api'
import type { PredictionPayload, PredictionResult } from './types'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0f4c81',
    },
    secondary: {
      main: '#00a8e8',
    },
    background: {
      default: '#f5f7fb',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h2: { fontWeight: 700 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e6f0',
          boxShadow: '0 12px 40px rgba(15,76,129,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

const App = () => {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (payload: PredictionPayload) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await predictRisk(payload)
      setResult(data)
    } catch (err) {
      const fallbackMessage =
        'Unable to reach the prediction API. Verify the backend service and try again.'
      if (err && typeof err === 'object' && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } }
        setError(errorObj.response?.data?.message ?? fallbackMessage)
      } else {
        setError(fallbackMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
            Health Risk Command Center
          </Typography>
          <Typography variant="h4" fontWeight={700} mt={1} gutterBottom>
            Longitudinal Health Risk Prediction
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4}>
            Intake multi-domain health signals, run AI-driven inference, and instantly operationalize interventions.
          </Typography>
          <HealthStepperForm onSubmit={handleSubmit} loading={loading} />
          {loading && <LinearProgress sx={{ mt: 3 }} />}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          <Fade in={Boolean(result)} timeout={400}>
            <Box>
              <Dashboard result={result} />
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App
