import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SplashScreen from './components/SplashScreen'
import { brandColors } from './theme'
import './index.css'

const IntakeApp = lazy(() => import('./App'))
const ResultView = lazy(() => import('./components/ResultView'))

const FullScreenLoader = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: brandColors.primary,
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif',
      letterSpacing: 1,
    }}
  >
    Loading predictive modules...
  </div>
)

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element with id "root" was not found in the DOM.')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/intake" element={<Navigate to="/intake/demographics" replace />} />
          <Route path="/intake/demographics" element={<IntakeApp />} />
          <Route path="/intake/vitals" element={<IntakeApp />} />
          <Route path="/intake/lifestyle" element={<IntakeApp />} />
          <Route path="/intake/result" element={<ResultView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
