import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

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
    <div style={{ marginTop:'6px', marginBottom:'4px' }}>
      <div style={{ display:'flex', gap:'3px', marginBottom:'6px' }}>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ flex:1, height:'3px', borderRadius:'2px', background: i<=passed ? barColor : 'var(--border)', transition:'background 0.2s' }} />
        ))}
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'4px' }}>
        {checks.map(c => (
          <span key={c.label} style={{
            fontSize:'10px', padding:'2px 7px', borderRadius:'4px',
            background: c.pass ? '#AAFF0018' : 'var(--bg-elevated)',
            color: c.pass ? '#AAFF00' : 'var(--text-muted)',
            border:`1px solid ${c.pass ? '#AAFF0033' : 'var(--border)'}`,
            fontFamily:'Space Mono,monospace', transition:'all 0.2s',
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
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [message, setMessage]     = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const setupSession = async () => {
      const hash = window.location.hash

      // Extract tokens from URL hash — Supabase puts them there after email click
      if (hash && hash.includes('access_token')) {
        const params = new URLSearchParams(hash.replace('#', ''))
        const access_token  = params.get('access_token')
        const refresh_token = params.get('refresh_token')

        if (access_token && refresh_token) {
          // Explicitly set the session — guarantees updateUser will work
          const { error } = await supabase.auth.setSession({ access_token, refresh_token })
          if (error) {
            setSessionError('Reset link is invalid or has expired. Please request a new one.')
            return
          }
          setSessionReady(true)
          return
        }
      }

      // No hash tokens — check if there is already a valid session
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSessionReady(true)
        return
      }

      // Nothing found — show error after 12s to allow for slow loads
      const timer = setTimeout(() => {
        setSessionError('Reset link expired or already used. Please request a new password reset.')
      }, 12000)
      return () => clearTimeout(timer)
    }

    setupSession()
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!passwordIsStrong(password)) { setMessage('Please meet all password requirements above'); return }
    if (password !== confirm) { setMessage('Passwords do not match'); return }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      // SUCCESS — sign out silently, show success screen
      setIsSuccess(true)
      supabase.auth.signOut().catch(() => {})

    } catch (err) {
      setMessage(err.message || 'Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = !passwordIsStrong(password) || !confirm || password !== confirm

  // ── Success screen ────────────────────────────────────────
  if (isSuccess) {
    return (
      <div style={{ minHeight:'100vh', background:'var(--bg-base)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px' }}>
        <div style={{ width:'100%', maxWidth:'420px', textAlign:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'40px', justifyContent:'center' }}>
            <div style={{ width:'32px', height:'32px', background:'#AAFF00', color:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'11px', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>TIF</div>
            <span style={{ fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'15px', letterSpacing:'0.18em', color:'var(--text-primary)' }}>TRACEITFLOW</span>
          </div>
          <div style={{ background:'var(--bg-surface)', border:'1px solid #AAFF0033', borderRadius:'14px', padding:'40px 32px', boxShadow:'0 0 40px #AAFF0011' }}>
            <div style={{ width:'64px', height:'64px', borderRadius:'50%', background:'#AAFF0018', border:'2px solid #AAFF00', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', fontSize:'28px' }}>✓</div>
            <h2 style={{ fontFamily:'Space Mono,monospace', fontSize:'20px', fontWeight:700, color:'#AAFF00', marginBottom:'12px' }}>Password Updated!</h2>
            <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'28px', lineHeight:1.6, fontFamily:'DM Sans,sans-serif' }}>
              Your password has been changed successfully. Sign in with your new password to continue.
            </p>
            <button
              onClick={() => navigate('/auth')}
              style={{ width:'100%', padding:'14px', background:'#AAFF00', color:'#0D0D0D', border:'none', borderRadius:'8px', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:'13px', fontWeight:700, letterSpacing:'0.12em', boxShadow:'0 0 20px #AAFF0033', transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 0 32px #AAFF0055'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='0 0 20px #AAFF0033'}
            >
              ← GO TO LOGIN
            </button>
          </div>
          <p style={{ textAlign:'center', fontSize:'10px', color:'var(--text-muted)', marginTop:'24px', fontFamily:'Space Mono,monospace', letterSpacing:'0.12em' }}>TRACEITFLOW · BY RICO KAY</p>
        </div>
      </div>
    )
  }

  // ── Main form ─────────────────────────────────────────────
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
            <div style={{ padding:'16px', borderRadius:'10px', background:'#FF444411', border:'1px solid #FF444433', color:'#FF4444', fontSize:'13px', marginBottom:'16px', lineHeight:1.5, fontFamily:'DM Sans,sans-serif' }}>
              {sessionError}
              <button onClick={() => navigate('/auth')} style={{ display:'block', marginTop:'12px', padding:'8px 16px', background:'#AAFF00', color:'#0D0D0D', border:'none', borderRadius:'6px', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:'11px', fontWeight:700 }}>← Back to Login</button>
            </div>
          )}

          {!sessionReady && !sessionError && (
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

          {sessionReady && !sessionError && (
            <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div>
                <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', marginBottom:'6px' }}>NEW PASSWORD</label>
                <div style={{ position:'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters" required autoFocus
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

              {message && (
                <div style={{ padding:'12px 14px', borderRadius:'8px', background:'#FF444411', border:'1px solid #FF444433', color:'#FF4444', fontSize:'13px', fontFamily:'DM Sans,sans-serif', lineHeight:1.5 }}>
                  ✕ {message}
                </div>
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
        </div>

        <p style={{ textAlign:'center', fontSize:'10px', color:'var(--text-muted)', marginTop:'24px', fontFamily:'Space Mono,monospace', letterSpacing:'0.12em' }}>TRACEITFLOW · BY RICO KAY</p>
      </div>
    </div>
  )
}
