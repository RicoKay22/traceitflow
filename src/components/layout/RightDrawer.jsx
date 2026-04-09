import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { X, Code2, Zap } from 'lucide-react'

function ComplexityBadge({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '3px', padding: '10px 12px',
      background: 'var(--bg-base)', border: '1px solid var(--border)',
      borderRadius: '8px', flex: 1,
    }}>
      <span style={{ fontSize: '14px', fontWeight: 700, fontFamily: 'Space Mono, monospace', color: color || 'var(--text-primary)' }}>{value}</span>
      <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
    </div>
  )
}

function PseudocodePanel({ lines = [], activeLine }) {
  if (!lines.length) return (
    <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
      No pseudocode available
    </div>
  )
  return (
    <div style={{ background: 'var(--bg-base)', borderRadius: '8px', padding: '12px', overflow: 'auto', border: '1px solid var(--border)' }}>
      {lines.map((line, idx) => (
        <div key={idx} style={{
          display: 'flex', gap: '12px', alignItems: 'baseline',
          padding: '3px 8px', borderRadius: '4px',
          borderLeft: idx === activeLine ? '2px solid #AAFF00' : '2px solid transparent',
          background: idx === activeLine ? '#AAFF0012' : 'transparent',
          transition: 'all 0.15s ease',
        }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', minWidth: '16px', userSelect: 'none', opacity: 0.5 }}>
            {idx + 1}
          </span>
          <span style={{ fontSize: '12px', lineHeight: 1.8, fontFamily: 'JetBrains Mono, monospace', color: idx === activeLine ? '#AAFF00' : 'var(--text-primary)', whiteSpace: 'pre' }}>
            {line || ' '}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function RightDrawer({ open, onClose, algorithm, currentSnapshot }) {
  if (!algorithm) return null
  const activeLine = currentSnapshot?.codeLine ?? -1

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.2)' }} />
        <Dialog.Content style={{
          position: 'fixed', top: '56px', right: 0, bottom: 0, width: '360px', zIndex: 50,
          background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', outline: 'none',
          animation: 'slideInRight 0.25s ease',
        }}>
          <style>{`
            @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
            .tif-tab[data-state="active"] { background:#AAFF00 !important; color:#0D0D0D !important; box-shadow:0 0 8px #AAFF0033; }
            .tif-tab { transition: all 0.15s ease; }
            .tif-tab:hover:not([data-state="active"]) { color: var(--text-primary) !important; }
          `}</style>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code2 size={16} color="#AAFF00" />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                {algorithm.name}
              </span>
            </div>
            <Dialog.Close asChild>
              <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: '4px', borderRadius: '6px' }}
                onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
              ><X size={16} /></button>
            </Dialog.Close>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', marginBottom: '8px' }}>DESCRIPTION</p>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.7, fontFamily: 'DM Sans, sans-serif' }}>{algorithm.description}</p>
            </div>

            <div>
              <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', marginBottom: '8px' }}>COMPLEXITY</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <ComplexityBadge label="Best"    value={algorithm.complexity.best}    color="#AAFF00" />
                <ComplexityBadge label="Average" value={algorithm.complexity.average} color="#00FFD1" />
                <ComplexityBadge label="Worst"   value={algorithm.complexity.worst}   color="#FF4444" />
                <ComplexityBadge label="Space"   value={algorithm.complexity.space}   color="#A78BFA" />
              </div>
            </div>

            <div>
              <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', marginBottom: '8px' }}>PSEUDOCODE</p>
              <Tabs.Root defaultValue="javascript">
                <Tabs.List style={{ display: 'flex', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: '8px', padding: '3px', marginBottom: '10px' }}>
                  {[['javascript','JS'],['python','PY'],['c','C']].map(([val, label]) => (
                    <Tabs.Trigger key={val} value={val} className="tif-tab" style={{
                      flex: 1, padding: '6px 0', borderRadius: '6px',
                      fontFamily: 'Space Mono, monospace', fontSize: '10px',
                      letterSpacing: '0.12em', fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                      background: 'transparent', color: 'var(--text-muted)',
                    }}>{label}</Tabs.Trigger>
                  ))}
                </Tabs.List>
                {['javascript','python','c'].map(lang => (
                  <Tabs.Content key={lang} value={lang}>
                    <PseudocodePanel lines={algorithm.pseudocode?.[lang] || []} activeLine={activeLine} />
                  </Tabs.Content>
                ))}
              </Tabs.Root>
            </div>

            {currentSnapshot?.description && (
              <div style={{ padding: '12px 14px', borderRadius: '8px', background: '#AAFF0011', border: '1px solid #AAFF0022' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Zap size={11} color="#AAFF00" />
                  <span style={{ fontSize: '9px', color: '#AAFF00', fontFamily: 'Space Mono, monospace', letterSpacing: '0.15em' }}>CURRENT STEP</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-primary)', fontFamily: 'Space Mono, monospace', lineHeight: 1.5 }}>
                  {currentSnapshot.description}
                </p>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
