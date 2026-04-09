import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { Sun, Moon, LogOut, User, ChevronDown } from 'lucide-react'

export default function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const { profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <style>{`
        .topbar-btn:hover { background: var(--bg-elevated) !important; }
        .dropdown-item:hover { background: var(--bg-elevated) !important; color: var(--text-primary) !important; }
        .theme-toggle:hover { border-color: var(--accent-primary) !important; }
        .user-chip:hover { border-color: #AAFF0055 !important; }
      `}</style>

      <header style={{
        height: '56px',
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        flexShrink: 0,
      }}>

        {/* Left — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: '#AAFF00', color: '#0D0D0D',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '10px',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
            flexShrink: 0,
          }}>AL</div>
          <span style={{
            fontFamily: 'Space Mono, monospace', fontWeight: 700,
            fontSize: '14px', letterSpacing: '0.18em', color: 'var(--text-primary)',
          }}>ALGOLAB</span>
          <span style={{
            fontSize: '10px', color: 'var(--text-muted)',
            fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em',
            display: window.innerWidth < 600 ? 'none' : 'block',
          }}>/ COMMAND CENTER</span>
        </div>

        {/* Right — controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Theme toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            style={{
              width: '36px', height: '36px', borderRadius: '8px',
              background: 'transparent', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
              transition: 'all 0.2s ease',
            }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark'
              ? <Sun size={15} strokeWidth={1.8} />
              : <Moon size={15} strokeWidth={1.8} />}
          </button>

          {/* User chip */}
          <div style={{ position: 'relative' }}>
            <button
              className="user-chip"
              onClick={() => setMenuOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 10px', borderRadius: '8px',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              {/* Avatar circle */}
              <div style={{
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #AAFF00, #00FFD1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '10px', fontWeight: 700, color: '#0D0D0D',
                fontFamily: 'Space Mono, monospace', flexShrink: 0,
              }}>
                {profile?.username ? profile.username[0].toUpperCase() : <User size={12} />}
              </div>
              <span style={{
                fontSize: '12px', color: 'var(--text-primary)',
                fontFamily: 'Space Mono, monospace', maxWidth: '80px',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {profile?.username || 'User'}
              </span>
              <ChevronDown
                size={12}
                color="var(--text-muted)"
                style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              />
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div style={{
                position: 'absolute', top: '44px', right: 0,
                background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: '10px', padding: '6px',
                minWidth: '160px', zIndex: 100,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{
                  padding: '8px 10px 10px',
                  borderBottom: '1px solid var(--border)',
                  marginBottom: '4px',
                }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>Signed in as</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'Space Mono, monospace', marginTop: '2px' }}>
                    {profile?.username || 'User'}
                  </div>
                </div>
                <button
                  className="dropdown-item"
                  onClick={() => { signOut(); setMenuOpen(false) }}
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

      {/* Close menu on outside click */}
      {menuOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
