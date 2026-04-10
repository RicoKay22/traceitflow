import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'
import Sidebar from '../components/layout/Sidebar'
import { useAuth } from '../context/AuthContext'
import {
  BarChart2, Search, GitBranch,
  ArrowRight, Clock, Zap, Trophy,
} from 'lucide-react'
import { ALGORITHMS } from '../algorithms/index'
import { Swords } from 'lucide-react'

// ─── Stat Card ───────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '20px',
      display: 'flex', flexDirection: 'column', gap: '4px',
    }}>
      <div style={{
        fontSize: '28px', fontWeight: 700,
        fontFamily: 'Space Mono, monospace', color: color || '#AAFF00',
      }}>{value}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  )
}

// ─── Algorithm Card ──────────────────────────────────────────
function AlgoCard({ algo, onClick }) {
  const [hovered, setHovered] = useState(false)

  const categoryIcon = {
    sorting: BarChart2,
    searching: Search,
    graph: GitBranch,
  }
  const Icon = categoryIcon[algo.category] || Zap

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${hovered ? algo.accentColor + '55' : 'var(--border)'}`,
        borderRadius: '12px', padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        cursor: 'pointer', transition: 'all 0.2s ease',
        textAlign: 'left', width: '100%',
        boxShadow: hovered ? `0 4px 20px ${algo.accentColor}18` : 'none',
      }}
    >
      {/* Icon + category */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px',
          background: algo.accentColor + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${algo.accentColor}33`,
        }}>
          <Icon size={16} color={algo.accentColor} strokeWidth={1.8} />
        </div>
        <span style={{
          fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)',
          fontFamily: 'Space Mono, monospace',
          background: 'var(--bg-elevated)', padding: '3px 7px',
          borderRadius: '5px', textTransform: 'uppercase',
        }}>
          {algo.category}
        </span>
      </div>

      {/* Name */}
      <div>
        <h3 style={{
          fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)',
          fontFamily: 'Space Mono, monospace', marginBottom: '6px',
        }}>{algo.name}</h3>
        <p style={{
          fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>{algo.description}</p>
      </div>

      {/* Complexity row */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {Object.entries(algo.complexity).map(([k, v]) => (
          <span key={k} style={{
            fontSize: '10px', padding: '2px 7px', borderRadius: '4px',
            background: 'var(--bg-elevated)', color: 'var(--text-muted)',
            fontFamily: 'Space Mono, monospace', border: '1px solid var(--border)',
          }}>
            {k}: {v}
          </span>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '4px',
        color: algo.accentColor, fontSize: '11px',
        fontFamily: 'Space Mono, monospace', fontWeight: 700,
        opacity: hovered ? 1 : 0.6, transition: 'opacity 0.2s',
      }}>
        Visualize <ArrowRight size={12} />
      </div>
    </button>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────
export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { profile } = useAuth()
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      minHeight: '100vh', background: 'var(--bg-base)',
    }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(p => !p)}
        />

        {/* Main content */}
        <main style={{
          flex: 1, overflowY: 'auto', padding: '32px',
        }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{
              fontSize: '11px', letterSpacing: '0.2em', color: 'var(--text-muted)',
              fontFamily: 'Space Mono, monospace', marginBottom: '6px',
            }}>
              {greeting.toUpperCase()},
            </p>
            <h1 style={{
              fontSize: '28px', fontWeight: 700,
              fontFamily: 'Space Mono, monospace', color: 'var(--text-primary)',
              marginBottom: '8px',
            }}>
              {profile?.username || 'Developer'} <span style={{ color: '#AAFF00' }}>↗</span>
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', maxWidth: '480px' }}>
              Pick an algorithm below to start visualizing. Watch every comparison, swap, and pivot happen in real time.
            </p>
          </div>

          {/* Stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '16px', marginBottom: '40px',
          }}>
            <StatCard value={ALGORITHMS.length} label="Algorithms" sub="Available now" color="#AAFF00" />
            <StatCard value="3" label="Languages" sub="JS · Python · C" color="#00FFD1" />
            <StatCard value="2" label="Modes" sub="Solo & Compare" color="#A78BFA" />
            <StatCard value="∞" label="Insights" sub="Step by step" color="#FFB800" />
          </div>

          {/* Algorithm grid */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{
                fontSize: '13px', fontWeight: 700,
                fontFamily: 'Space Mono, monospace', color: 'var(--text-primary)',
                letterSpacing: '0.1em',
              }}>
                ALL ALGORITHMS
              </h2>
              <span style={{
                fontSize: '10px', color: 'var(--text-muted)',
                fontFamily: 'Space Mono, monospace',
                background: 'var(--bg-elevated)',
                padding: '3px 8px', borderRadius: '5px',
                border: '1px solid var(--border)',
              }}>
                {ALGORITHMS.length} available
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {ALGORITHMS.map(algo => (
                <AlgoCard
                  key={algo.id}
                  algo={algo}
                  onClick={() => navigate(`/visualizer/${algo.id}`)}
                />
              ))}
            </div>
          </div>
          
          <div
  onClick={() => navigate('/compare')}
  style={{
    padding: '20px 24px', borderRadius: '12px',
    background: 'var(--bg-surface)', border: '1px solid #AAFF0033',
    display: 'flex', alignItems: 'center', gap: '16px',
    cursor: 'pointer', transition: 'all 0.2s ease',
    boxShadow: '0 0 20px #AAFF0011',
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor='#AAFF0066'; e.currentTarget.style.boxShadow='0 0 30px #AAFF0022' }}
  onMouseLeave={e => { e.currentTarget.style.borderColor='#AAFF0033'; e.currentTarget.style.boxShadow='0 0 20px #AAFF0011' }}
>
  <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:'#AAFF0018', border:'1px solid #AAFF0033', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
    <Swords size={20} color="#AAFF00" strokeWidth={1.8} />
  </div>
  <div style={{ flex: 1 }}>
    <p style={{ fontSize:'13px', fontWeight:700, color:'var(--text-primary)', fontFamily:'Space Mono, monospace', marginBottom:'3px' }}>COMPARISON MODE</p>
    <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Run two algorithms side by side on the same array. Watch them race in real time.</p>
  </div>
  <div style={{ color:'#AAFF00', fontFamily:'Space Mono, monospace', fontSize:'12px', fontWeight:700, flexShrink:0 }}>ENTER ↗</div>
</div>

          {/* Coming soon strip */}
          <div style={{
            padding: '20px 24px', borderRadius: '12px',
            background: 'var(--bg-surface)', border: '1px dashed var(--border)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            <Clock size={16} color="var(--text-muted)" />
            <div>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'Space Mono, monospace', marginBottom: '2px' }}>
                MORE COMING SOON
              </p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
  Graph traversal algorithms (BFS & DFS) coming in the next update.
</p>
            </div>
            <Trophy size={16} color="#FFB800" style={{ marginLeft: 'auto', flexShrink: 0 }} />
          </div>
        </main>
      </div>
    </div>
  )
}
