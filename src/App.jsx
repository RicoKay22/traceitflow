import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import VisualizerPage from './pages/VisualizerPage'
import ComparisonPage from './pages/ComparisonPage'
import NotFoundPage from './pages/NotFoundPage'
import UpdatePasswordPage, { RESET_FLAG } from './pages/UpdatePasswordPage'

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

function AppRoutes() {
  const { user } = useAuth()

  // Don't auto-redirect to dashboard if user is in the middle of a password reset
  const inPasswordReset = sessionStorage.getItem(RESET_FLAG) === 'true'

  return (
    <Routes>
      {/* Auth page: only redirect to dashboard if logged in AND NOT in password reset flow */}
      <Route
        path="/auth"
        element={(user && !inPasswordReset) ? <Navigate to="/" replace /> : <AuthPage />}
      />

      {/* Update password: always accessible — handles its own session logic */}
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
