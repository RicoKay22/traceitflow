import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import BB8Toggle from '../ui/BB8Toggle'
import { LogOut, User, ChevronDown } from 'lucide-react'

export default function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const { profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close menu on outside click using ref — avoids overlay z-index bug
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const handleSignOut = async (e) => {
    e.stopPropagation()
    setMenuOpen(false)
    await signOut()
  }

  return (
    <>
      <style>{`
        .dropdown-item:hover { background: var(--bg-elevated) !important; }
        .user-chip:hover { border-color: #AAFF0055 !important; }
        @media (max-width: 640px) {
          .topbar-subtitle { display: none !important; }
          .topbar-bb8 { transform: scale(0.75); transform-origin: right center; }
          .topbar-username { display: none !important; }
          .topbar-logo-text { font-size: 12px !important; letter-spacing: 0.1em !important; }
        }
      `}</style>

      <header style={{
        height: '56px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
        minWidth: 0,
      }}>
        {/* Left — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, overflow: 'hidden' }}>
          <div style={{
            width: '28px', height: '28px', flexShrink: 0,
            background: '#AAFF00', color: '#0D0D0D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '10px',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          }}>TIF</div>
          <span className="topbar-logo-text" style={{
            fontFamily: 'Space Mono, monospace', fontWeight: 700,
            fontSize: '13px', letterSpacing: '0.15em', color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>TRACEITFLOW</span>
          <span className="topbar-subtitle" style={{
            fontSize: '10px', color: 'var(--text-muted)',
            fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
          }}>/ COMMAND CENTER</span>
        </div>

        {/* Right — controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <div className="topbar-bb8">
            <BB8Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </div>

          {/* User chip — ref-based, no overlay div needed */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              className="user-chip"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 8px', borderRadius: '8px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #AAFF00, #00FFD1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: '#0D0D0D',
                fontFamily: 'Space Mono, monospace',
              }}>
                {profile?.username ? profile.username[0].toUpperCase() : <User size={12} />}
              </div>
              <span className="topbar-username" style={{
                fontSize: '12px', color: 'var(--text-primary)',
                fontFamily: 'Space Mono, monospace', maxWidth: '70px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {profile?.username || 'User'}
              </span>
              <ChevronDown
                size={12} color="var(--text-muted)"
                style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
              />
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', top: '44px', right: 0,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '6px',
                minWidth: '160px', zIndex: 100,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>Signed in as</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'Space Mono, monospace', marginTop: '2px' }}>
                    {profile?.username || 'User'}
                  </div>
                </div>
                <button
                  className="dropdown-item"
                  onMouseDown={handleSignOut}
                  style={{
                    width: '100%', padding: '8px 10px', borderRadius: '6px',
                    background: 'transparent', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    cursor: 'pointer', color: '#FF4444', fontSize: '12px',
                    fontFamily: 'Space Mono, monospace', transition: 'background 0.15s',
                  }}
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
