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
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-base)' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:'10px', color:'var(--text-muted)', marginBottom:'8px', letterSpacing:'0.2em' }}>TRACEITFLOW</div>
          <div style={{ fontFamily:'Space Mono,monospace', fontSize:'12px', color:'#AAFF00' }}>Initializing...</div>
        </div>
      </div>
    )
  }
  return user ? children : <Navigate to="/auth" replace />
}

// Checks URL hash for recovery token — works even after navigation
function isRecoveryUrl() {
  const hash = window.location.hash
  if (!hash) return false
  const params = new URLSearchParams(hash.replace('#', ''))
  return params.get('type') === 'recovery' || hash.includes('type=recovery')
}

function AuthGuard() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  // If user is logged in BUT this is a recovery flow — don't redirect
  // The recovery URL hash tells us this is a reset, not a normal login
  if (user && isRecoveryUrl()) {
    // Redirect to update-password page, carrying the hash
    return <Navigate to={`/update-password${location.hash}`} replace />
  }

  // Normal logged-in user → go to dashboard
  if (user) return <Navigate to="/" replace />

  return <AuthPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthGuard />} />
      {/* UpdatePasswordPage: always accessible, handles its own session */}
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
