/**
 * BarCanvas
 * Renders the current algorithm step as an array of colored bars.
 * Receives a snapshot from useAnimationPlayer and paints bar states.
 */

const BAR_COLORS = {
  default:   'var(--bar-default)',
  comparing: 'var(--bar-comparing)',
  swapping:  'var(--bar-swapping)',
  sorted:    'var(--bar-sorted)',
  pivot:     'var(--bar-pivot)',
  found:     'var(--bar-found)',
  searching: 'var(--bar-searching)',
}

const BAR_GLOW = {
  comparing: '0 0 12px var(--bar-comparing)',
  swapping:  '0 0 14px var(--bar-swapping)',
  pivot:     '0 0 12px var(--bar-pivot)',
  found:     '0 0 16px var(--bar-found)',
  searching: '0 0 10px var(--bar-searching)',
}

function getBarState(index, snapshot) {
  if (!snapshot) return 'default'
  if (snapshot.sorted?.includes(index))    return 'sorted'
  if (snapshot.swapping?.includes(index))  return 'swapping'
  if (snapshot.comparing?.includes(index)) return 'comparing'
  if (snapshot.pivot === index)            return 'pivot'
  if (snapshot.found === index)            return 'found'
  if (snapshot.searching?.includes(index)) return 'searching'
  return 'default'
}

export default function BarCanvas({ snapshot, totalElements = 20, accentColor }) {
  const array = snapshot?.array ?? Array.from({ length: totalElements }, (_, i) => i + 1)
  const maxVal = Math.max(...array)

  return (
    <div style={{
      width: '100%',
      background: 'var(--bg-base)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      padding: '24px 20px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* Bars */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '3px',
        height: '220px',
        width: '100%',
      }}>
        {array.map((val, idx) => {
          const state = getBarState(idx, snapshot)
          const color = BAR_COLORS[state] || BAR_COLORS.default
          const glow  = BAR_GLOW[state] || 'none'
          const heightPct = `${Math.max(4, (val / maxVal) * 100)}%`

          return (
            <div
              key={idx}
              style={{
                flex: 1,
                height: heightPct,
                background: color,
                boxShadow: glow,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.18s ease, background 0.15s ease, box-shadow 0.15s ease',
                minWidth: '3px',
                position: 'relative',
              }}
            >
              {/* Value label on bar — only show when array is small */}
              {array.length <= 20 && (
                <span style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontSize: '9px',
                  color: state !== 'default' ? color : 'var(--text-muted)',
                  fontFamily: 'Space Mono, monospace',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s',
                }}>
                  {val}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Step description */}
      <div style={{
        minHeight: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        {snapshot?.description ? (
          <>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: accentColor || '#AAFF00',
              boxShadow: `0 0 6px ${accentColor || '#AAFF00'}`,
              flexShrink: 0,
              display: 'inline-block',
            }} />
            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              fontFamily: 'Space Mono, monospace',
              letterSpacing: '0.02em',
            }}>
              {snapshot.description}
            </span>
          </>
        ) : (
          <span style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            fontFamily: 'Space Mono, monospace',
          }}>
            Press play to start the visualization
          </span>
        )}
      </div>

      {/* Bar state legend */}
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        borderTop: '1px solid var(--border)',
        paddingTop: '12px',
      }}>
        {[
          ['var(--bar-comparing)', 'Comparing'],
          ['var(--bar-swapping)',  'Swapping'],
          ['var(--bar-sorted)',    'Sorted'],
          ['var(--bar-pivot)',     'Pivot'],
        ].map(([color, label]) => (
          <span key={label} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '10px', color: 'var(--text-muted)',
            fontFamily: 'Space Mono, monospace',
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '2px',
              background: color, display: 'inline-block',
              flexShrink: 0,
            }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
