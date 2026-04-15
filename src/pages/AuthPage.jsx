import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function AnimatedBars() {
  const [bars, setBars] = useState(() =>
    Array.from({ length: 18 }, () => ({ height: Math.random() * 70 + 20, state: 'default' }))
  )
  useEffect(() => {
    let i = 0, j = 0, n = 18
    const interval = setInterval(() => {
      setBars(prev => {
        const next = prev.map(b => ({ ...b, state: 'default' }))
        if (j < n - i - 1) {
          next[j].state = 'comparing'; next[j + 1].state = 'comparing'
          if (next[j].height > next[j + 1].height) {
            const tmp = next[j].height; next[j].height = next[j+1].height; next[j+1].height = tmp
            next[j].state = 'swapping'; next[j+1].state = 'swapping'
          }
          j++
        } else {
          for (let k = n - 1 - i; k < n; k++) next[k].state = 'sorted'
          i++; j = 0
          if (i >= n - 1) { i = 0; j = 0; return next.map(() => ({ height: Math.random() * 70 + 20, state: 'default' })) }
        }
        return next
      })
    }, 280)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '120px', width: '100%' }}>
      {bars.map((b, i) => (
        <div key={i} style={{
          flex: 1, height: `${b.height}%`, borderRadius: '2px 2px 0 0',
          background: b.state==='comparing'?'#AAFF00':b.state==='swapping'?'#FF4444':b.state==='sorted'?'#FFB800':'#2A2A2A',
          boxShadow: b.state==='comparing'?'0 0 10px #AAFF0088':b.state==='swapping'?'0 0 10px #FF444488':'none',
          transition: 'height 0.28s ease, background 0.2s ease',
        }} />
      ))}
    </div>
  )
}

function Typewriter({ texts }) {
  const [idx, setIdx] = useState(0)
  const [shown, setShown] = useState('')
  const [del, setDel] = useState(false)
  useEffect(() => {
    const t = texts[idx]
    let timer
    if (!del && shown.length < t.length) timer = setTimeout(() => setShown(t.slice(0, shown.length+1)), 75)
    else if (!del) timer = setTimeout(() => setDel(true), 2200)
    else if (del && shown.length > 0) timer = setTimeout(() => setShown(shown.slice(0,-1)), 35)
    else { setDel(false); setIdx((idx+1)%texts.length) }
    return () => clearTimeout(timer)
  }, [shown, del, idx, texts])
  return <span style={{ color: '#AAFF00' }}>{shown}<span style={{ animation: 'blink 1s step-end infinite' }}>|</span></span>
}

function InputField({ label, type, name, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display:'block', marginBottom:'6px', fontSize:'10px', letterSpacing:'0.2em', color:'var(--text-muted)', fontFamily:'Space Mono,monospace' }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <input type={inputType} name={name} value={value} onChange={onChange} placeholder={placeholder}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width:'100%', padding: isPassword ? '12px 44px 12px 16px' : '12px 16px',
            background:'var(--bg-elevated)',
            border:`1px solid ${focused ? '#AAFF00' : 'var(--border)'}`,
            borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px',
            fontFamily:'DM Sans,sans-serif', outline:'none', boxSizing:'border-box',
            transition:'border-color 0.2s, box-shadow 0.2s',
            boxShadow: focused ? '0 0 0 3px #AAFF0018' : 'none',
          }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShowPassword(s => !s)}
            style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)',
              padding:'0', display:'flex', alignItems:'center' }}>
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

function PasswordStrengthHint({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ characters', pass: password.length >= 8 },
    { label: 'Uppercase (A-Z)', pass: /[A-Z]/.test(password) },
    { label: 'Lowercase (a-z)', pass: /[a-z]/.test(password) },
    { label: 'Number (0-9)', pass: /[0-9]/.test(password) },
    { label: 'Special (!@#$...)', pass: /[^a-zA-Z0-9]/.test(password) },
  ]
  const passed = checks.filter(c => c.pass).length
  const barColor = passed <= 2 ? '#FF4444' : passed <= 3 ? '#FFB800' : passed <= 4 ? '#00FFD1' : '#AAFF00'
  return (
    <div style={{ marginTop: '-8px', marginBottom: '12px' }}>
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

// Check if password meets all requirements
function passwordIsStrong(pwd) {
  return pwd.length >= 8 &&
    /[A-Z]/.test(pwd) &&
    /[a-z]/.test(pwd) &&
    /[0-9]/.test(pwd) &&
    /[^a-zA-Z0-9]/.test(pwd)
}

// FIXED: Don't intercept our own custom error messages
function getFriendlyError(msg) {
  if (!msg) return ''
  // Preserve our own custom messages — don't intercept them
  if (msg.includes('No account found')) return msg
  if (msg.includes('registered with')) return msg
  if (msg.includes('Too many requests') || msg.includes('rate limit')) return 'Too many attempts. Please wait a few minutes and try again.'
  if (msg.includes('Error sending recovery email')) return 'Could not send email right now. Please try again in a few minutes.'
  if (msg.includes('Password should contain') || msg.includes('password strength') || msg.includes('Password should')) {
    return 'Your password needs: at least 8 characters, one uppercase (A-Z), one lowercase (a-z), one number (0-9), and one special character (!@#$...)'
  }
  if (msg.includes('User already registered') || msg.includes('already been registered')) return 'This email is already registered. Try logging in instead.'
  if (msg.includes('Invalid login credentials')) return 'Incorrect email or password. Please try again.'
  if (msg.includes('Email not confirmed')) return 'Please check your email and click the confirmation link first.'
  return msg
}

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email:'', password:'', username:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => { setForm(p => ({ ...p, [e.target.name]: e.target.value })); setError('') }

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      if (mode === 'login') { await signIn(form.email, form.password); navigate('/') }
      else {
        if (!form.username.trim()) { setError('Username is required'); setLoading(false); return }
        await signUp(form.email, form.password, form.username); setSuccess(true)
      }
    } catch (err) { setError(getFriendlyError(err.message) || 'Something went wrong') }
    finally { setLoading(false) }
  }

  const handleGoogle = async () => {
    setOauthLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/` } })
    if (error) { setError(error.message); setOauthLoading(false) }
  }

  // SIMPLIFIED: Remove profiles check — just send reset email directly
  // This avoids false negatives when profile/email data is missing
  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) { setError('Please enter your email address'); return }
    setResetLoading(true); setError('')
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/update-password`,
      })
      if (error) throw error
      setResetSent(true)
    } catch (err) {
      setError(getFriendlyError(err.message) || 'Failed to send reset email. Please try again.')
    } finally { setResetLoading(false) }
  }

  const switchMode = m => { setMode(m); setError(''); setSuccess(false); setForm({ email:'', password:'', username:'' }) }

  const registerDisabled = mode === 'register' && !passwordIsStrong(form.password)

  return (
    <>
      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 16px #AAFF0033}50%{box-shadow:0 0 32px #AAFF0066}}
        .traceitflow-left{display:none}
        @media(min-width:900px){.traceitflow-left{display:flex}}
        .form-anim{animation:fadeUp 0.45s ease forwards}
        .goog-btn:hover{background:var(--bg-elevated) !important;border-color:#AAFF0055 !important}
        .sub-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 0 28px #AAFF0066 !important}
        .sw-link:hover{opacity:0.8}
      `}</style>

      <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg-base)', fontFamily:'DM Sans,sans-serif' }}>
        {/* LEFT PANEL */}
        <div className="traceitflow-left" style={{ width:'50%', flexDirection:'column', justifyContent:'space-between', padding:'48px', background:'#080808', borderRight:'1px solid var(--border)', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:'linear-gradient(#AAFF00 1px,transparent 1px),linear-gradient(90deg,#AAFF00 1px,transparent 1px)', backgroundSize:'44px 44px' }} />
          <div style={{ position:'absolute', top:'42%', left:'50%', transform:'translate(-50%,-50%)', width:'420px', height:'420px', borderRadius:'50%', background:'radial-gradient(circle,#AAFF0018,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'relative', zIndex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
              <div style={{ width:'34px', height:'34px', background:'#AAFF00', color:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'11px', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)', animation:'glowPulse 3s ease-in-out infinite' }}>TIF</div>
              <span style={{ fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'18px', letterSpacing:'0.2em', color:'var(--text-primary)' }}>TRACEITFLOW</span>
            </div>
            <p style={{ color:'var(--text-muted)', fontSize:'10px', letterSpacing:'0.35em', fontFamily:'Space Mono,monospace' }}>BY RICO KAY</p>
          </div>
          <div style={{ position:'relative', zIndex:1 }}>
            <p style={{ fontSize:'10px', letterSpacing:'0.2em', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', marginBottom:'14px' }}>● LIVE — BUBBLE SORT</p>
            <AnimatedBars />
            <div style={{ display:'flex', gap:'20px', marginTop:'12px', marginBottom:'40px' }}>
              {[['#AAFF00','Comparing'],['#FF4444','Swapping'],['#FFB800','Sorted']].map(([c,l])=>(
                <span key={l} style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'11px', color:'var(--text-muted)', fontFamily:'Space Mono,monospace' }}>
                  <span style={{ width:'8px', height:'8px', borderRadius:'50%', background:c, display:'inline-block', boxShadow:`0 0 6px ${c}66` }} />{l}
                </span>
              ))}
            </div>
            <h1 style={{ fontFamily:'Space Mono,monospace', fontSize:'34px', fontWeight:700, lineHeight:1.3, marginBottom:'16px', color:'var(--text-primary)' }}>
              Trace the logic.<br />
              <Typewriter texts={['Step by step.','Think clearly.','Build faster.','Understand deeply.']} />
            </h1>
            <p style={{ fontSize:'14px', color:'var(--text-muted)', lineHeight:1.75, maxWidth:'340px' }}>
              Watch algorithms animate step by step. Pseudocode syncs in real time. Built for developers who learn by seeing.
            </p>
          </div>
          <div style={{ position:'relative', zIndex:1, display:'flex', gap:'40px' }}>
            {[['7','Algorithms'],['3','Languages'],['∞','Insights']].map(([n,l])=>(
              <div key={l}>
                <div style={{ fontFamily:'Space Mono,monospace', fontSize:'26px', fontWeight:700, color:'#AAFF00' }}>{n}</div>
                <div style={{ fontSize:'12px', color:'var(--text-muted)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
          <div className="form-anim" style={{ width:'100%', maxWidth:'420px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'32px' }}>
              <div style={{ width:'28px', height:'28px', background:'#AAFF00', color:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'10px', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>TIF</div>
              <span style={{ fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'14px', letterSpacing:'0.2em' }}>TRACEITFLOW</span>
            </div>

            <div style={{ display:'flex', background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'10px', padding:'4px', marginBottom:'32px' }}>
              {['login','register'].map(tab => (
                <button key={tab} onClick={() => switchMode(tab)} style={{ flex:1, padding:'10px 0', borderRadius:'7px', fontFamily:'Space Mono,monospace', fontSize:'11px', letterSpacing:'0.12em', fontWeight:700, background:mode===tab?'#AAFF00':'transparent', color:mode===tab?'#0D0D0D':'var(--text-muted)', border:'none', cursor:'pointer', transition:'all 0.2s ease', boxShadow:mode===tab?'0 0 10px #AAFF0044':'none' }}>{tab.toUpperCase()}</button>
              ))}
            </div>

            <h2 style={{ fontFamily:'Space Mono,monospace', fontSize:'24px', fontWeight:700, marginBottom:'6px', color:'var(--text-primary)' }}>
              {mode==='login' ? 'Welcome back.' : 'Join TRACEITFLOW.'}
            </h2>
            <p style={{ fontSize:'14px', color:'var(--text-muted)', marginBottom:'28px' }}>
              {mode==='login' ? 'Sign in to continue your algorithm journey.' : 'Create an account to start visualizing.'}
            </p>

            <button className="goog-btn" onClick={handleGoogle} disabled={oauthLoading} style={{ width:'100%', padding:'12px 16px', background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text-primary)', fontSize:'14px', fontFamily:'DM Sans,sans-serif', fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', cursor:'pointer', marginBottom:'20px', transition:'all 0.2s ease' }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {oauthLoading ? 'Redirecting...' : 'Continue with Google'}
            </button>

            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
              <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
              <span style={{ fontSize:'10px', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', letterSpacing:'0.1em' }}>OR</span>
              <div style={{ flex:1, height:'1px', background:'var(--border)' }} />
            </div>

            {success && (
              <div style={{ padding:'14px 16px', borderRadius:'8px', marginBottom:'16px', background:'#AAFF0011', border:'1px solid #AAFF0033', color:'#AAFF00', fontSize:'13px', fontFamily:'Space Mono,monospace' }}>
                ✓ Account created! Check your email to confirm, then sign in.
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                  <InputField label="USERNAME" type="text" name="username" value={form.username} onChange={handleChange} placeholder="e.g. rico_kay" />
                )}
                <InputField label="EMAIL" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                <InputField label="PASSWORD" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 8 characters" />
                {mode === 'register' && <PasswordStrengthHint password={form.password} />}

                {/* Forgot password - login mode only */}
                {mode === 'login' && (
                  <div style={{ marginBottom:'16px' }}>
                    {!resetMode ? (
                      <div style={{ textAlign:'right', marginTop:'-8px' }}>
                        <button type="button" onClick={() => { setResetMode(true); setError('') }}
                          style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'11px', fontFamily:'Space Mono,monospace', transition:'color 0.2s' }}
                          onMouseEnter={e => e.target.style.color='#AAFF00'}
                          onMouseLeave={e => e.target.style.color='var(--text-muted)'}
                        >Forgot password?</button>
                      </div>
                    ) : resetSent ? (
                      <div style={{ padding:'14px 16px', borderRadius:'8px', background:'#AAFF0011', border:'1px solid #AAFF0033', color:'#AAFF00', fontSize:'13px', fontFamily:'Space Mono,monospace' }}>
                        ✓ If an account exists for {resetEmail}, a reset link has been sent. Check your inbox.
                        <button type="button" onClick={() => { setResetMode(false); setResetSent(false); setResetEmail('') }}
                          style={{ display:'block', marginTop:'8px', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'11px', fontFamily:'Space Mono,monospace' }}>
                          ← Back to login
                        </button>
                      </div>
                    ) : (
                      <div style={{ padding:'14px 16px', borderRadius:'8px', background:'var(--bg-elevated)', border:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'10px' }}>
                        <p style={{ fontSize:'10px', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', letterSpacing:'0.15em', margin:0 }}>ENTER YOUR EMAIL TO RESET PASSWORD</p>
                        <div style={{ display:'flex', gap:'8px' }}>
                          <input type="email" value={resetEmail} onChange={e => { setResetEmail(e.target.value); setError('') }} placeholder="you@example.com"
                            onFocus={e => e.target.style.borderColor='#AAFF00'} onBlur={e => e.target.style.borderColor='var(--border)'}
                            style={{ flex:1, padding:'10px 12px', background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'7px', color:'var(--text-primary)', fontSize:'13px', fontFamily:'DM Sans,sans-serif', outline:'none', transition:'border-color 0.2s' }}
                          />
                          <button type="button" onClick={handleForgotPassword} disabled={resetLoading}
                            style={{ padding:'10px 14px', background:resetLoading?'#AAFF0055':'#AAFF00', color:'#0D0D0D', border:'none', borderRadius:'7px', cursor:resetLoading?'not-allowed':'pointer', fontSize:'11px', fontFamily:'Space Mono,monospace', fontWeight:700, whiteSpace:'nowrap' }}>
                            {resetLoading ? '...' : 'SEND →'}
                          </button>
                        </div>
                        <button type="button" onClick={() => { setResetMode(false); setError('') }}
                          style={{ alignSelf:'flex-start', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'11px', fontFamily:'Space Mono,monospace' }}>
                          ← Cancel
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div style={{ padding:'12px 14px', borderRadius:'8px', marginBottom:'14px', background:'#FF444411', border:'1px solid #FF444433', color:'#FF4444', fontSize:'13px', fontFamily:'DM Sans,sans-serif', lineHeight:1.5 }}>
                    ✕ {error}
                  </div>
                )}

                {/* Register: disabled until password is strong. Login: always enabled */}
                <button type="submit"
                  disabled={loading || (mode === 'register' && registerDisabled)}
                  className="sub-btn"
                  title={mode === 'register' && registerDisabled ? 'Complete all password requirements above' : ''}
                  style={{
                    width:'100%', padding:'14px',
                    background: (loading || (mode === 'register' && registerDisabled)) ? '#AAFF0044' : '#AAFF00',
                    color: (loading || (mode === 'register' && registerDisabled)) ? '#0D0D0D88' : '#0D0D0D',
                    border:'none', borderRadius:'8px',
                    fontFamily:'Space Mono,monospace', fontSize:'13px', fontWeight:700,
                    letterSpacing:'0.12em',
                    cursor: (loading || (mode === 'register' && registerDisabled)) ? 'not-allowed' : 'pointer',
                    transition:'all 0.2s ease',
                    boxShadow: (loading || (mode === 'register' && registerDisabled)) ? 'none' : '0 0 20px #AAFF0033',
                    marginTop:'4px',
                  }}>
                  {loading ? 'PROCESSING...' : mode==='login' ? 'SIGN IN →' :
                    registerDisabled ? 'COMPLETE PASSWORD REQUIREMENTS' : 'CREATE ACCOUNT →'}
                </button>

                {mode === 'register' && registerDisabled && (
                  <p style={{ textAlign:'center', fontSize:'11px', color:'var(--text-muted)', marginTop:'6px', fontFamily:'DM Sans,sans-serif' }}>
                    Complete all password requirements above to continue
                  </p>
                )}
              </form>
            )}

            <p style={{ textAlign:'center', fontSize:'13px', color:'var(--text-muted)', marginTop:'20px' }}>
              {mode==='login' ? "Don't have an account? " : 'Already have an account? '}
              <button className="sw-link" onClick={() => switchMode(mode==='login'?'register':'login')} style={{ color:'#AAFF00', background:'none', border:'none', cursor:'pointer', fontFamily:'Space Mono,monospace', fontSize:'12px', transition:'opacity 0.2s' }}>
                {mode==='login' ? 'Register here' : 'Sign in'}
              </button>
            </p>

            <p style={{ textAlign:'center', fontSize:'10px', color:'var(--text-muted)', marginTop:'44px', fontFamily:'Space Mono,monospace', letterSpacing:'0.12em' }}>
              BUILT BY RICO KAY · WHERE DESIGN MEETS LOGIC
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
