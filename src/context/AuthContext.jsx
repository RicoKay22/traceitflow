import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null)
  const [profile, setProfile]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [isRecovery, setIsRecovery] = useState(false)
  const isProcessingAuth = useRef(false)

  useEffect(() => {
    // If user landed on the recovery URL, skip ALL normal auth init
    // This prevents the lock contention between setSession + getSession + onAuthStateChange
    const isRecoveryFlow = window.location.pathname === '/update-password' ||
                           window.location.hash.includes('type=recovery')

    if (isRecoveryFlow) {
      setLoading(false)
      return // Don't set up any listeners — UpdatePasswordPage handles everything
    }

    // Normal flow only
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Prevent overlapping auth requests
      if (isProcessingAuth.current) return
      isProcessingAuth.current = true

      try {
        if (event === 'SIGNED_OUT') {
          setUser(null)
          setProfile(null)
          setIsRecovery(false)
          return
        }

        if (event === 'PASSWORD_RECOVERY') {
          setIsRecovery(true)
          setUser(session?.user ?? null)
          if (session?.user) fetchProfile(session.user.id)
          return
        }

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          await ensureProfile(session.user)
          fetchProfile(session.user.id)
          return
        }

        if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user)
          return
        }

      } finally {
        isProcessingAuth.current = false
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }

  async function ensureProfile(user) {
    if (!user) return
    const { data: existing } = await supabase
      .from('profiles').select('id, username, email').eq('id', user.id).single()
    if (!existing) {
      const username =
        user.user_metadata?.full_name?.split(' ')[0] ||
        user.user_metadata?.name?.split(' ')[0] ||
        user.email?.split('@')[0] || 'User'
      await supabase.from('profiles').insert({
        id: user.id, username,
        email: user.email?.toLowerCase(),
        preferred_speed: 1.0, last_algorithm: 'bubbleSort', theme: 'dark',
      })
    } else if (!existing.email && user.email) {
      await supabase.from('profiles')
        .update({ email: user.email.toLowerCase() })
        .eq('id', user.id)
    }
  }

  async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id, username: username.trim(),
        email: email.toLowerCase().trim(),
        preferred_speed: 1.0, last_algorithm: 'bubbleSort', theme: 'dark',
      })
    }
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    // Hard reset local state immediately — don't wait for server
    setUser(null)
    setProfile(null)
    setIsRecovery(false)
    // Fire server signout in background
    supabase.auth.signOut().catch(() => {})
  }

  async function updatePreferences(updates) {
    if (!user) return
    await supabase.from('profiles').update(updates).eq('id', user.id)
    setProfile(prev => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isRecovery, signUp, signIn, signOut, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
