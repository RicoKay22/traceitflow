import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  BarChart2, Search, GitBranch,
  ChevronDown, ChevronRight, Zap,
} from 'lucide-react'
import { ALGORITHMS } from '../../algorithms/index'

const CATEGORIES = [
  { id: 'sorting',   label: 'Sorting',   icon: BarChart2,  color: '#AAFF00' },
  { id: 'searching', label: 'Searching', icon: Search,     color: '#00FFD1' },
  { id: 'graph',     label: 'Graph',     icon: GitBranch,  color: '#A78BFA' },
]

export default function Sidebar({ collapsed, onToggleCollapse }) {
  const navigate = useNavigate()
  const { algorithmId } = useParams()
  const [openCategories, setOpenCategories] = useState(['sorting'])

  const toggleCategory = (id) => {
    setOpenCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  const algosByCategory = (catId) => ALGORITHMS.filter(a => a.category === catId)

  return (
    <>
      <style>{`
        .algo-item:hover { background: var(--bg-elevated) !important; }
        .algo-item.active { background: #AAFF0011 !important; border-color: #AAFF0033 !important; }
        .cat-header:hover { background: var(--bg-elevated) !important; }
        .sidebar-collapse:hover { background: var(--bg-elevated) !important; }
      `}</style>

      <aside style={{
        width: collapsed ? '56px' : '220px',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        transition: 'width 0.25s ease',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* Collapse toggle */}
        <button
          className="sidebar-collapse"
          onClick={onToggleCollapse}
          style={{
            position: 'absolute', top: '12px', right: '8px',
            width: '24px', height: '24px', borderRadius: '6px',
            background: 'transparent', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-muted)',
            transition: 'background 0.15s', zIndex: 2, flexShrink: 0,
          }}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronRight
            size={14}
            style={{ transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.25s' }}
          />
        </button>

        {/* Top section */}
        <div style={{ padding: collapsed ? '12px 8px' : '16px 12px', borderBottom: '1px solid var(--border)' }}>
          {!collapsed && (
            <p style={{
              fontSize: '9px', letterSpacing: '0.25em', color: 'var(--text-muted)',
              fontFamily: 'Space Mono, monospace', marginBottom: '4px', paddingRight: '28px',
            }}>
              ALGORITHMS
            </p>
          )}
        </div>

        {/* Categories */}
        <div style={{ flex: 1, overflowY: 'auto', padding: collapsed ? '8px 6px' : '8px' }}>
          {CATEGORIES.map(cat => {
            const algos = algosByCategory(cat.id)
            const isOpen = openCategories.includes(cat.id)
            const Icon = cat.icon

            return (
              <div key={cat.id} style={{ marginBottom: '4px' }}>
                {/* Category header */}
                <button
                  className="cat-header"
                  onClick={() => !collapsed && toggleCategory(cat.id)}
                  title={collapsed ? cat.label : undefined}
                  style={{
                    width: '100%', padding: collapsed ? '8px' : '7px 8px',
                    borderRadius: '7px', background: 'transparent', border: 'none',
                    display: 'flex', alignItems: 'center',
                    gap: collapsed ? 0 : '8px',
                    cursor: 'pointer', transition: 'background 0.15s',
                    justifyContent: collapsed ? 'center' : 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={15} color={cat.color} strokeWidth={1.8} />
                    {!collapsed && (
                      <span style={{
                        fontSize: '11px', fontFamily: 'Space Mono, monospace',
                        color: 'var(--text-primary)', fontWeight: 700,
                        letterSpacing: '0.08em',
                      }}>
                        {cat.label}
                      </span>
                    )}
                  </div>
                  {!collapsed && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        fontSize: '9px', color: 'var(--text-muted)',
                        fontFamily: 'Space Mono, monospace',
                        background: 'var(--bg-elevated)',
                        padding: '1px 5px', borderRadius: '4px',
                      }}>
                        {algos.length}
                      </span>
                      <ChevronDown
                        size={11} color="var(--text-muted)"
                        style={{ transform: isOpen ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
                      />
                    </div>
                  )}
                </button>

                {/* Algorithm list */}
                {!collapsed && isOpen && (
                  <div style={{ paddingLeft: '8px', marginTop: '2px' }}>
                    {algos.length === 0 ? (
                      <div style={{
                        padding: '6px 10px', fontSize: '11px',
                        color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace',
                        fontStyle: 'italic',
                      }}>
                        Coming soon
                      </div>
                    ) : (
                      algos.map(algo => (
                        <button
                          key={algo.id}
                          className={`algo-item ${algorithmId === algo.id ? 'active' : ''}`}
                          onClick={() => navigate(`/visualizer/${algo.id}`)}
                          style={{
                            width: '100%', padding: '7px 10px',
                            borderRadius: '6px', background: 'transparent',
                            border: '1px solid transparent',
                            display: 'flex', alignItems: 'center', gap: '7px',
                            cursor: 'pointer', transition: 'all 0.15s',
                            marginBottom: '2px', textAlign: 'left',
                          }}
                        >
                          <Zap size={11} color={algo.accentColor} strokeWidth={2} />
                          <span style={{
                            fontSize: '12px', color: 'var(--text-primary)',
                            fontFamily: 'DM Sans, sans-serif',
                          }}>
                            {algo.name}
                          </span>
                          {algorithmId === algo.id && (
                            <span style={{
                              marginLeft: 'auto', width: '6px', height: '6px',
                              borderRadius: '50%', background: algo.accentColor,
                              boxShadow: `0 0 6px ${algo.accentColor}`,
                              flexShrink: 0,
                            }} />
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Bottom — version */}
        {!collapsed && (
          <div style={{
            padding: '12px', borderTop: '1px solid var(--border)',
          }}>
            <p style={{
              fontSize: '9px', color: 'var(--text-muted)',
              fontFamily: 'Space Mono, monospace', letterSpacing: '0.15em',
            }}>
              ALGOLAB v1.0 · RICO KAY
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
