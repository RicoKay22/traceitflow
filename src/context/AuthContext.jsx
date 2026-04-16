import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await ensureProfile(session.user)
        fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    const { data } = await supabase
      .from('profiles').select('*').eq('id', userId).single()
    if (data) setProfile(data)
  }

  // SAFE: never overwrites existing username
  async function ensureProfile(user) {
    if (!user) return

    // Check if profile exists — select username too so we can preserve it
    const { data: existing } = await supabase
      .from('profiles').select('id, username, email').eq('id', user.id).single()

    if (!existing) {
      // No profile row at all — create one
      // For Google OAuth users, use their display name; for email users, use email prefix
      const username =
        user.user_metadata?.full_name?.split(' ')[0] ||
        user.user_metadata?.name?.split(' ')[0] ||
        user.email?.split('@')[0] ||
        'User'

      // INSERT not upsert — if profile already exists, do nothing
      await supabase.from('profiles').insert({
        id: user.id,
        username,
        email: user.email?.toLowerCase(),
        preferred_speed: 1.0,
        last_algorithm: 'bubbleSort',
        theme: 'dark',
      }).select()
    } else {
      // Profile exists — ONLY fill in missing email, NEVER touch username
      if (!existing.email && user.email) {
        await supabase
          .from('profiles')
          .update({ email: user.email.toLowerCase() })
          .eq('id', user.id)
      }
    }
  }

  async function signUp(email, password, username) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      // INSERT not upsert — preserve username always
      await supabase.from('profiles').insert({
        id: data.user.id,
        username: username.trim(),
        email: email.toLowerCase().trim(),
        preferred_speed: 1.0,
        last_algorithm: 'bubbleSort',
        theme: 'dark',
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
    await supabase.auth.signOut()
  }

  async function updatePreferences(updates) {
    if (!user) return
    await supabase.from('profiles').update(updates).eq('id', user.id)
    setProfile(prev => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
