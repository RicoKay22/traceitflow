import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import VisualizerPage from './pages/VisualizerPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'var(--bg-base)' }}>
        <div className="text-center">
          <div className="font-mono text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
            ALGOLAB
          </div>
          <div className="font-mono text-sm animate-pulse" style={{ color: 'var(--accent-primary)' }}>
            Initializing...
          </div>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/auth" replace />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? <Navigate to="/" replace /> : <AuthPage />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visualizer/:algorithmId"
        element={
          <ProtectedRoute>
            <VisualizerPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
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
