import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [count, setCount] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(c => {
        if (c <= 1) { clearInterval(timer); navigate('/'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Space Mono, monospace', padding: '24px',
    }}>
      <style>{`
        @keyframes glitch {
          0%,100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, 1px); }
          80% { transform: translate(1px, -1px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .tif-404 { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div className="tif-404" style={{ textAlign: 'center', maxWidth: '480px' }}>
        {/* TIF logo */}
        <div style={{
          width: '56px', height: '56px', background: '#AAFF00', color: '#0D0D0D',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '16px', margin: '0 auto 24px',
          clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
        }}>TIF</div>

        {/* 404 number */}
        <div style={{
          fontSize: '96px', fontWeight: 700, lineHeight: 1,
          color: '#AAFF00', marginBottom: '8px',
          animation: 'glitch 2s ease-in-out infinite',
          textShadow: '2px 2px 0 #FF4444, -2px -2px 0 #00FFD1',
        }}>
          404
        </div>

        {/* Message */}
        <h2 style={{
          fontSize: '18px', color: 'var(--text-primary)',
          marginBottom: '12px', fontWeight: 700,
        }}>
          Algorithm not found.
        </h2>
        <p style={{
          fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7,
          marginBottom: '32px',
        }}>
          This path doesn't exist in our registry.<br />
          Even a linear search couldn't find it.
        </p>

        {/* Progress bar countdown */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '8px' }}>
            REDIRECTING IN {count}s
          </p>
          <div style={{ width: '200px', height: '3px', background: 'var(--border)', borderRadius: '9999px', margin: '0 auto', overflow: 'hidden' }}>
            <div style={{
              height: '100%', background: '#AAFF00', borderRadius: '9999px',
              width: `${(count / 10) * 100}%`,
              transition: 'width 1s linear',
              boxShadow: '0 0 6px #AAFF00',
            }} />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 20px', background: '#AAFF00', color: '#0D0D0D',
              border: 'none', borderRadius: '8px', cursor: 'pointer',
              fontSize: '12px', fontWeight: 700, fontFamily: 'Space Mono, monospace',
              boxShadow: '0 0 16px #AAFF0044', transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px #AAFF0077'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 16px #AAFF0044'}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Footer */}
        <p style={{ marginTop: '48px', fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
          TRACEITFLOW · BY RICO KAY
        </p>
      </div>
    </div>
  )
}
