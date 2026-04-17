import { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import BB8Toggle from '../ui/BB8Toggle'
import { LogOut, User, ChevronDown } from 'lucide-react'

export default function TopBar() {
  const { theme, toggleTheme }   = useTheme()
  const { profile, signOut }     = useAuth()
  const navigate                 = useNavigate()
  const [menuOpen, setMenuOpen]           = useState(false)
  const [confirmSignOut, setConfirmSignOut] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
        setConfirmSignOut(false)
      }
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 10)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [menuOpen])

  const handleSignOutConfirm = () => {
    // Close UI immediately — don't wait for server
    setMenuOpen(false)
    setConfirmSignOut(false)

    // Navigate to /auth immediately — this clears the protected route
    navigate('/auth', { replace: true })

    // Fire signOut in background — don't await, don't block
    signOut().catch(() => {})
  }

  return (
    <>
      <style>{`
        .tif-dropdown-item:hover { background: var(--bg-elevated) !important; }
        .tif-user-chip:hover { border-color: #AAFF0055 !important; }
        @media (max-width: 640px) {
          .topbar-subtitle { display: none !important; }
          .topbar-bb8 { transform: scale(0.75); transform-origin: right center; }
          .topbar-username { display: none !important; }
          .topbar-logo-text { font-size: 12px !important; letter-spacing: 0.1em !important; }
        }
      `}</style>

      <header style={{
        height: '56px', background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', position: 'sticky', top: 0, zIndex: 50,
        flexShrink: 0, minWidth: 0,
      }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'8px', minWidth:0, overflow:'hidden' }}>
          <div style={{ width:'28px', height:'28px', flexShrink:0, background:'#AAFF00', color:'#0D0D0D', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'10px', clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>TIF</div>
          <span className="topbar-logo-text" style={{ fontFamily:'Space Mono,monospace', fontWeight:700, fontSize:'13px', letterSpacing:'0.15em', color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>TRACEITFLOW</span>
          <span className="topbar-subtitle" style={{ fontSize:'10px', color:'var(--text-muted)', fontFamily:'Space Mono,monospace', letterSpacing:'0.1em', whiteSpace:'nowrap' }}>/ COMMAND CENTER</span>
        </div>

        {/* Right controls */}
        <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
          <div className="topbar-bb8">
            <BB8Toggle checked={theme === 'dark'} onChange={toggleTheme} />
          </div>

          <div ref={menuRef} style={{ position:'relative' }}>
            <button
              className="tif-user-chip"
              onClick={() => { setMenuOpen(o => !o); setConfirmSignOut(false) }}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 8px', borderRadius:'8px', background:'var(--bg-elevated)', border:'1px solid var(--border)', cursor:'pointer', transition:'all 0.2s ease' }}
            >
              <div style={{ width:'24px', height:'24px', borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg, #AAFF00, #00FFD1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:700, color:'#0D0D0D', fontFamily:'Space Mono,monospace' }}>
                {profile?.username ? profile.username[0].toUpperCase() : <User size={12} />}
              </div>
              <span className="topbar-username" style={{ fontSize:'12px', color:'var(--text-primary)', fontFamily:'Space Mono,monospace', maxWidth:'70px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {profile?.username || 'User'}
              </span>
              <ChevronDown size={12} color="var(--text-muted)" style={{ transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition:'transform 0.2s', flexShrink:0 }} />
            </button>

            {menuOpen && (
              <div style={{ position:'absolute', top:'44px', right:0, background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'10px', padding:'6px', minWidth:'190px', zIndex:100, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
                <div style={{ padding:'8px 10px 10px', borderBottom:'1px solid var(--border)', marginBottom:'4px' }}>
                  <div style={{ fontSize:'11px', color:'var(--text-muted)', fontFamily:'Space Mono,monospace' }}>Signed in as</div>
                  <div style={{ fontSize:'12px', color:'var(--text-primary)', fontFamily:'Space Mono,monospace', marginTop:'2px', fontWeight:700 }}>{profile?.username || 'User'}</div>
                </div>

                {!confirmSignOut ? (
                  <button
                    className="tif-dropdown-item"
                    onClick={() => setConfirmSignOut(true)}
                    style={{ width:'100%', padding:'8px 10px', borderRadius:'6px', background:'transparent', border:'none', display:'flex', alignItems:'center', gap:'8px', cursor:'pointer', color:'#FF4444', fontSize:'12px', fontFamily:'Space Mono,monospace', transition:'background 0.15s' }}
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                ) : (
                  <div style={{ padding:'10px' }}>
                    <p style={{ fontSize:'12px', color:'var(--text-primary)', fontFamily:'Space Mono,monospace', marginBottom:'10px', lineHeight:1.4 }}>
                      Sign out of TraceItFlow?
                    </p>
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button
                        onClick={() => setConfirmSignOut(false)}
                        style={{ flex:1, padding:'7px', borderRadius:'6px', background:'var(--bg-elevated)', border:'1px solid var(--border)', cursor:'pointer', color:'var(--text-muted)', fontSize:'11px', fontFamily:'Space Mono,monospace' }}
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={handleSignOutConfirm}
                        style={{ flex:1, padding:'7px', borderRadius:'6px', background:'#FF4444', border:'none', cursor:'pointer', color:'#fff', fontSize:'11px', fontFamily:'Space Mono,monospace', fontWeight:700 }}
                      >
                        SIGN OUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  )
}
