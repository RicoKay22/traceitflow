import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

// Flag key — tells App.jsx not to redirect to dashboard while we're on this page
export const RESET_FLAG = 'tif_password_reset_active'

function PasswordStrengthHint({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ characters',    pass: password.length >= 8 },
    { label: 'Uppercase (A-Z)',   pass: /[A-Z]/.test(password) },
    { label: 'Lowercase (a-z)',   pass: /[a-z]/.test(password) },
    { label: 'Number (0-9)',      pass: /[0-9]/.test(password) },
    { label: 'Special (!@#$...)', pass: /[^a-zA-Z0-9]/.test(password) },
  ]
  const passed = checks.filter(c => c.pass).length
  const barColor = passed <= 2 ? '#FF4444' : passed <= 3 ? '#FFB800' : passed <= 4 ? '#00FFD1' : '#AAFF00'
  return (
    <div style={{ marginTop: '6px', marginBottom: '4px' }}>
      <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ flex:1, height:'3px', borderRadius:'2px', background: i<=passed ? barColor : 'var(--border)', transition:'background 0.2s' }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {checks.map(c => (
          <span key={c.label} style={{
            fontSize:'10px', padding:'2px 7px', borderRadius:'4px',
            background: c.pass ? '#AAFF0018' : 'var(--bg-elevated)',
            color: c.pass ? '#AAFF00' : 'var(--text-muted)',
            border:`1px solid ${c.pass ? '#AAFF0033' : 'var(--border)'}`,
            fontFamily:'Space Mono, monospace', transition:'all 0.2s',
          }}>
            {c.pass ? '✓' : '·'} {c.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function passwordIsStrong(pwd) {
  return pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /[0-9]/.test(pwd) && /[^a-zA-Z0-9]/.test(pwd)
}

export default function UpdatePasswordPage() {
  const [password, setPassword]           = useState('')
  const [confirm, setConfirm]             = useState('')
  const [showPass, setShowPass]           = useState(false)
  const [loading, setLoading]             = useState(false)
  const [message, setMessage]             = useState('')
  const [isSuccess, setIsSuccess]         = useState(false)
  const [sessionReady, setSessionReady]   = useState(false)
  const [sessionError, setSessionError]   = useState('')
  const navigate = useNavigate()
  const passwordUpdatedRef = useRef(false)

  useEffect(() => {
    // Set flag so /auth route won't auto-redirect to dashboard
    sessionStorage.setItem(RESET_FLAG, 'true')

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setSessionReady(true)
        setSessionError('')
      }
    })

    const checkHash = async () => {
      const hash = window.location.hash
      if (hash && (hash.includes('access_token') || hash.includes('type=recovery'))) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        if (accessToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })
          if (error) setSessionError('Reset link is invalid or has expired. Please request a new one.')
          else setSessionReady(true)
          return
        }
      }
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setSessionReady(true)
      } else {
        setTimeout(async () => {
          const { data: later } = await supabase.auth.getSession()
          if (later.session) setSessionReady(true)
          else setSessionError('Reset link expired or already used. Please request a new password reset.')
        }, 8000)
      }
    }
    checkHash()

    return () => {
      subscription.unsubscribe()
      sessionStorage.removeItem(RESET_FLAG)
      // Sign out if user navigated away without updating password
      if (!passwordUpdatedRef.current) {
        supabase.auth.signOut()
      }
    }
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!passwordIsStrong(password)) { setMessage('Please meet all password requirements above'); return }
    if (password !== confirm) { setMessage('Passwords do not match'); return }

    setLoading(true)
    setMessage('')

    try {
      // 10 second timeout so it never hangs forever
      const { error } = await Promise.race([
        supabase.auth.updateUser({ password }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Update timed out — please try again.')), 10000)
        ),
      ])

      if (error) throw error

      // Mark done so cleanup won't sign out again
      passwordUpdatedRef.current = true
      sessionStorage.removeItem(RESET_FLAG)

      setIsSuccess(true)
      setMessage('Password updated successfully!')

      // Sign out, then redirect to login
      await supabase.auth.signOut()
      setTimeout(() => navigate('/auth'), 2500)

    } catch (err) {
      setMessage(err.message || 'Failed to update password. Please try again.')
    } finally {
      // Always reset loading — this was the hang bug
      setLoading(false)
    }
  }

  const isDisabled = !passwordIsStrong(password) || !confirm || password !== confirm

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>

        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'40px', justifyContent:'center' }}>
          <div style={{ width:'32px', height:'32px', background:'#AAFF00', color:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'11px', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>TIF</div>
          <span style={{ fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'15px', letterSpacing:'0.18em', color:'var(--text-primary)' }}>TRACEITFLOW</span>
        </div>

        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'14px', padding:'32px' }}>
          <h2 style={{ fontFamily:'Space Mono,monospace', fontSize:'20px', fontWeight:700, color:'var(--text-primary)', marginBottom:'6px' }}>Set new password.</h2>
          <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'24px' }}>Choose a strong password for your TraceItFlow account.</p>

          {sessionError && (
            <div style={{ padding:'16px', borderRadius:'10px', background:'#FF444411', border:'1px solid #FF444433', color:'#FF4444', fontFamily:'DM Sans,sans-serif', fontSize:'13px', marginBottom:'16px', lineHeight:1.5 }}>
              {sessionError}
              <button onClick={() => navigate('/auth')} style={{ display:'block', marginTop:'12px', padding:'8px 16px', background:'#AAFF00', color:'#0D0D0D', border:'none', borderRadius:'6px', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:'11px', fontWeight:700 }}>← Back to Login</button>
            </div>
          )}

          {isSuccess && (
            <div style={{ padding:'20px 16px', borderRadius:'10px', background:'#AAFF0011', border:'1px solid #AAFF0033', color:'#AAFF00', fontFamily:'Space Mono,monospace', fontSize:'13px', textAlign:'center' }}>
              <div style={{ fontSize:'28px', marginBottom:'8px' }}>✓</div>
              <div style={{ marginBottom:'4px', fontWeight:700 }}>Password updated successfully!</div>
              <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'8px' }}>Redirecting to login in a moment...</div>
              <button onClick={() => navigate('/auth')} style={{ marginTop:'14px', padding:'8px 16px', background:'#AAFF00', color:'#0D0D0D', border:'none', borderRadius:'6px', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:'11px', fontWeight:700 }}>
                ← Go to Login Now
              </button>
            </div>
          )}

          {!isSuccess && !sessionError && sessionReady && (
            <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div>
                <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', marginBottom:'6px' }}>NEW PASSWORD</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters" required
                    style={{ width:'100%', padding:'12px 44px 12px 16px', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', fontFamily:'DM Sans,sans-serif', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor='#AAFF00'}
                    onBlur={e => e.target.style.borderColor='var(--border)'}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPass ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
                <PasswordStrengthHint password={password} />
              </div>

              <div>
                <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', marginBottom:'6px' }}>CONFIRM PASSWORD</label>
                <input
                  type={showPass ? 'text' : 'password'} value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password" required
                  style={{ width:'100%', padding:'12px 16px', background:'var(--bg-elevated)', border:`1px solid ${confirm && confirm !== password ? '#FF4444' : confirm && confirm === password && passwordIsStrong(password) ? '#AAFF00' : 'var(--border)'}`, borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', fontFamily:'DM Sans,sans-serif', outline:'none', boxSizing:'border-box', transition:'border-color 0.2s' }}
                />
                {confirm && confirm !== password && <p style={{ fontSize:'11px', color:'#FF4444', marginTop:'4px' }}>Passwords do not match</p>}
                {confirm && confirm === password && passwordIsStrong(password) && <p style={{ fontSize:'11px', color:'#AAFF00', marginTop:'4px' }}>✓ Passwords match</p>}
              </div>

              {message && !isSuccess && (
                <div style={{ padding:'12px 14px', borderRadius:'8px', background:'#FF444411', border:'1px solid #FF444433', color:'#FF4444', fontSize:'13px', fontFamily:'DM Sans,sans-serif', lineHeight:1.5 }}>✕ {message}</div>
              )}

              <button type="submit" disabled={loading || isDisabled} style={{
                padding:'14px',
                background: (loading || isDisabled) ? '#AAFF0033' : '#AAFF00',
                color: (loading || isDisabled) ? '#0D0D0D66' : '#0D0D0D',
                border:'none', borderRadius:'8px',
                fontFamily:'Space Mono,monospace', fontSize:'13px', fontWeight:700,
                letterSpacing:'0.12em',
                cursor: (loading || isDisabled) ? 'not-allowed' : 'pointer',
                transition:'all 0.2s',
                boxShadow: (loading || isDisabled) ? 'none' : '0 0 20px #AAFF0033',
              }}>
                {loading ? 'UPDATING...' : isDisabled ? 'COMPLETE REQUIREMENTS ABOVE' : 'UPDATE PASSWORD →'}
              </button>
            </form>
          )}

          {!sessionReady && !sessionError && !isSuccess && (
            <div style={{ textAlign:'center', padding:'32px 20px' }}>
              <div style={{ fontFamily:'Space Mono,monospace', fontSize:'12px', color:'var(--text-muted)', marginBottom:'12px' }}>Verifying reset link...</div>
              <div style={{ display:'flex', gap:'4px', justifyContent:'center' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#AAFF00', animation:'pulse 1.2s ease-in-out infinite', animationDelay:`${i * 0.2}s` }} />
                ))}
              </div>
              <style>{`@keyframes pulse{0%,100%{opacity:0.3}50%{opacity:1}}`}</style>
            </div>
          )}
        </div>

        <p style={{ textAlign:'center', fontSize:'10px', color:'var(--text-muted)', marginTop:'24px', fontFamily:'Space Mono,monospace', letterSpacing:'0.12em' }}>TRACEITFLOW · BY RICO KAY</p>
      </div>
    </div>
  )
}
