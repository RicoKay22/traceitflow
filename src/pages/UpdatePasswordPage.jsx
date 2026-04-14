import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleRecoverySession = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('type=recovery')) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        if (accessToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          })
          if (error) setSessionError('Reset link is invalid or expired. Please request a new one.')
          else setSessionReady(true)
        } else {
          setSessionError('Invalid reset link. Please request a new password reset.')
        }
      } else {
        const { data } = await supabase.auth.getSession()
        if (data.session) setSessionReady(true)
        else setSessionError('No reset session found. Please request a new password reset link.')
      }
    }
    handleRecoverySession()
  }, [])

  const getPasswordError = (pwd) => {
    const missing = []
    if (pwd.length < 8) missing.push('at least 8 characters')
    if (!/[a-z]/.test(pwd)) missing.push('a lowercase letter (a-z)')
    if (!/[A-Z]/.test(pwd)) missing.push('an uppercase letter (A-Z)')
    if (!/[0-9]/.test(pwd)) missing.push('a number (0-9)')
    if (!/[^a-zA-Z0-9]/.test(pwd)) missing.push('a special character e.g. !@#$%')
    return missing.length > 0 ? `Your password needs: ${missing.join(', ')}` : null
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const pwdError = getPasswordError(password)
    if (pwdError) { setMessage(pwdError); return }
    if (password !== confirm) { setMessage('Passwords do not match — please check and try again'); return }
    setLoading(true); setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setIsSuccess(true)
      setMessage('Password updated! Redirecting to login...')
      await supabase.auth.signOut()
      setTimeout(() => navigate('/auth'), 2500)
    } catch (err) {
      setMessage(err.message || 'Failed to update password')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg-base)', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px', fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'40px', justifyContent:'center' }}>
          <div style={{ width:'32px', height:'32px', background:'#AAFF00', color:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'11px', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>TIF</div>
          <span style={{ fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'15px', letterSpacing:'0.18em', color:'var(--text-primary)' }}>TRACEITFLOW</span>
        </div>
        <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'14px', padding:'32px' }}>
          <h2 style={{ fontFamily:'Space Mono,monospace', fontSize:'20px', fontWeight:700, color:'var(--text-primary)', marginBottom:'6px' }}>Set new password.</h2>
          <p style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'24px' }}>Choose a strong password for your TraceItFlow account.</p>

          {sessionError && (
            <div style={{ padding:'16px', borderRadius:'10px', background:'#FF444411', border:'1px solid #FF444433', color:'#FF4444', fontFamily:'DM Sans,sans-serif', fontSize:'13px', marginBottom:'16px' }}>
              {sessionError}
              <button onClick={() => navigate('/auth')} style={{ display:'block', marginTop:'12px', padding:'8px 16px', background:'#AAFF00', color:'#0D0D0D', border:'none', borderRadius:'6px', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:'11px', fontWeight:700 }}>← Back to Login</button>
            </div>
          )}

          {isSuccess && (
            <div style={{ padding:'16px', borderRadius:'10px', background:'#AAFF0011', border:'1px solid #AAFF0033', color:'#AAFF00', fontFamily:'Space Mono,monospace', fontSize:'13px', textAlign:'center' }}>✓ {message}</div>
          )}

          {!isSuccess && !sessionError && sessionReady && (
            <form onSubmit={handleUpdate} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
              <div>
                <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', marginBottom:'6px' }}>NEW PASSWORD</label>
                <div style={{ position:'relative' }}>
                  <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Min. 8 characters" required
                    style={{ width:'100%', padding:'12px 44px 12px 16px', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', fontFamily:'DM Sans,sans-serif', outline:'none', boxSizing:'border-box' }}
                    onFocus={e=>e.target.style.borderColor='#AAFF00'} onBlur={e=>e.target.style.borderColor='var(--border)'}
                  />
                  <button type="button" onClick={()=>setShowPass(s=>!s)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', alignItems:'center' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {showPass?<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>:<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
                    </svg>
                  </button>
                </div>
                <p style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'6px' }}>Needs uppercase, lowercase, number and special character (!@#$...)</p>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'10px', letterSpacing:'0.2em', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', marginBottom:'6px' }}>CONFIRM PASSWORD</label>
                <input type={showPass?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Repeat your password" required
                  style={{ width:'100%', padding:'12px 16px', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', fontFamily:'DM Sans,sans-serif', outline:'none', boxSizing:'border-box' }}
                  onFocus={e=>e.target.style.borderColor='#AAFF00'} onBlur={e=>e.target.style.borderColor='var(--border)'}
                />
              </div>
              {message && !isSuccess && (
                <div style={{ padding:'12px 14px', borderRadius:'8px', background:'#FF444411', border:'1px solid #FF444433', color:'#FF4444', fontSize:'13px', fontFamily:'DM Sans,sans-serif', lineHeight:1.5 }}>✕ {message}</div>
              )}
              <button type="submit" disabled={loading} style={{ padding:'14px', background:loading?'#AAFF0055':'#AAFF00', color:'#0D0D0D', border:'none', borderRadius:'8px', fontFamily:'Space Mono,monospace', fontSize:'13px', fontWeight:700, letterSpacing:'0.12em', cursor:loading?'not-allowed':'pointer', transition:'all 0.2s', boxShadow:loading?'none':'0 0 20px #AAFF0033' }}>
                {loading?'UPDATING...':'UPDATE PASSWORD →'}
              </button>
            </form>
          )}

          {!sessionReady && !sessionError && (
            <div style={{ textAlign:'center', padding:'20px', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', fontSize:'12px' }}>Verifying reset link...</div>
          )}
        </div>
        <p style={{ textAlign:'center', fontSize:'10px', color:'var(--text-muted)', marginTop:'24px', fontFamily:'Space Mono,monospace', letterSpacing:'0.12em' }}>TRACEITFLOW · BY RICO KAY</p>
      </div>
    </div>
  )
}
