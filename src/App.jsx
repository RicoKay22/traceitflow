import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import VisualizerPage from './pages/VisualizerPage'
import ComparisonPage from './pages/ComparisonPage'
import NotFoundPage from './pages/NotFoundPage'
import UpdatePasswordPage from './pages/UpdatePasswordPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '0.2em' }}>TRACEITFLOW</div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', color: '#AAFF00' }}>Initializing...</div>
        </div>
      </div>
    )
  }
  return user ? children : <Navigate to="/auth" replace />
}

// Auth page guard: redirect logged-in users to dashboard
// EXCEPT when they came from a password reset link (URL contains access_token)
function AuthGuard() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  // If the URL hash contains a recovery token, NEVER auto-redirect
  // This handles the case where user navigates back to /auth after visiting /update-password
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const isRecovery = hashParams.get('type') === 'recovery' || location.hash.includes('type=recovery')

  if (user && !isRecovery) {
    return <Navigate to="/" replace />
  }

  return <AuthPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthGuard />} />
      {/* UpdatePasswordPage is always accessible — never redirect away from it */}
      <Route path="/update-password" element={<UpdatePasswordPage />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/visualizer/:algorithmId" element={<ProtectedRoute><VisualizerPage /></ProtectedRoute>} />
      <Route path="/compare" element={<ProtectedRoute><ComparisonPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
