import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (password.length < 8) { setMessage('Password must be at least 8 characters'); return }
    if (password !== confirm) { setMessage('Passwords do not match'); return }

    setLoading(true); setMessage('')
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setIsSuccess(true)
      setMessage('Password updated successfully! Redirecting...')
      setTimeout(() => navigate('/'), 2500)
    } catch (err) {
      setMessage(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  const EyeIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {showPass
        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      }
    </svg>
  )

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', fontFamily: 'DM Sans, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', justifyContent: 'center' }}>
          <div style={{
            width: '32px', height: '32px', background: '#AAFF00', color: '#0D0D0D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '11px',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          }}>TIF</div>
          <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '15px', letterSpacing: '0.18em', color: 'var(--text-primary)' }}>
            TRACEITFLOW
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: '14px', padding: '32px',
        }}>
          <h2 style={{
            fontFamily: 'Space Mono, monospace', fontSize: '20px',
            fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px',
          }}>
            Set new password.
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>
            Choose a strong password for your TraceItFlow account.
          </p>

          {isSuccess ? (
            <div style={{
              padding: '16px', borderRadius: '10px',
              background: '#AAFF0011', border: '1px solid #AAFF0033',
              color: '#AAFF00', fontFamily: 'Space Mono, monospace', fontSize: '13px',
              textAlign: 'center',
            }}>
              ✓ {message}
            </div>
          ) : (
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* New password */}
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', marginBottom: '6px' }}>
                  NEW PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    style={{
                      width: '100%', padding: '12px 44px 12px 16px',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px',
                      fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={e => e.target.style.borderColor = '#AAFF00'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <EyeIcon />
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', marginBottom: '6px' }}>
                  CONFIRM PASSWORD
                </label>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  required
                  style={{
                    width: '100%', padding: '12px 16px',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                    borderRadius: '8px', color: 'var(--text-primary)', fontSize: '14px',
                    fontFamily: 'DM Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor = '#AAFF00'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              {/* Error message */}
              {message && !isSuccess && (
                <div style={{
                  padding: '12px 14px', borderRadius: '8px',
                  background: '#FF444411', border: '1px solid #FF444433',
                  color: '#FF4444', fontSize: '12px', fontFamily: 'Space Mono, monospace',
                }}>
                  ✕ {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '14px', background: loading ? '#AAFF0055' : '#AAFF00',
                  color: '#0D0D0D', border: 'none', borderRadius: '8px',
                  fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700,
                  letterSpacing: '0.12em', cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 0 20px #AAFF0033',
                }}
              >
                {loading ? 'UPDATING...' : 'UPDATE PASSWORD →'}
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '24px', fontFamily: 'Space Mono, monospace', letterSpacing: '0.12em' }}>
          TRACEITFLOW · BY RICO KAY
        </p>
      </div>
    </div>
  )
}
