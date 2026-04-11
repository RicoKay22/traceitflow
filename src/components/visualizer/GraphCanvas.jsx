/**
 * GraphCanvas
 * Renders a graph as SVG nodes and edges.
 * Used for BFS and DFS visualizations instead of BarCanvas.
 */

// Fixed node positions for the 8-node demo graph
const NODE_POSITIONS = {
  0: { x: 280, y: 60  },
  1: { x: 140, y: 160 },
  2: { x: 420, y: 160 },
  3: { x: 60,  y: 280 },
  4: { x: 200, y: 280 },
  5: { x: 360, y: 280 },
  6: { x: 500, y: 280 },
  7: { x: 130, y: 390 },
}

function getNodeColor(nodeId, snapshot) {
  if (!snapshot) return 'var(--bg-elevated)'
  if (snapshot.currentNode === nodeId)    return '#AAFF00'
  if (snapshot.visitedNodes?.includes(nodeId)) return '#00FFD1'
  if (snapshot.queueNodes?.includes(nodeId))   return '#A78BFA'
  return 'var(--bg-elevated)'
}

function getNodeGlow(nodeId, snapshot) {
  if (!snapshot) return 'none'
  if (snapshot.currentNode === nodeId) return '0 0 16px #AAFF00'
  if (snapshot.visitedNodes?.includes(nodeId)) return '0 0 8px #00FFD144'
  return 'none'
}

function getEdgeColor(a, b, snapshot) {
  if (!snapshot) return 'var(--border)'
  const aVisited = snapshot.visitedNodes?.includes(a)
  const bVisited = snapshot.visitedNodes?.includes(b)
  if (aVisited && bVisited) return '#00FFD133'
  return 'var(--border)'
}

export default function GraphCanvas({ snapshot, algorithmName }) {
  const nodes = snapshot?.graphNodes ?? Object.keys(NODE_POSITIONS).map(Number)
  const edges = snapshot?.graphEdges ?? []

  return (
    <div style={{
      width: '100%',
      background: 'var(--bg-base)',
      borderRadius: '12px',
      border: '1px solid var(--border)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    }}>
      {/* SVG Graph */}
      <div style={{ width: '100%', overflowX: 'auto' }}>
        <svg
          viewBox="0 0 560 460"
          style={{ width: '100%', maxHeight: '300px' }}
        >
          {/* Edges */}
          {edges.map(([a, b], idx) => {
            const posA = NODE_POSITIONS[a]
            const posB = NODE_POSITIONS[b]
            if (!posA || !posB) return null
            return (
              <line
                key={idx}
                x1={posA.x} y1={posA.y}
                x2={posB.x} y2={posB.y}
                stroke={getEdgeColor(a, b, snapshot)}
                strokeWidth="2"
                style={{ transition: 'stroke 0.3s ease' }}
              />
            )
          })}

          {/* Nodes */}
          {nodes.map(nodeId => {
            const pos = NODE_POSITIONS[nodeId]
            if (!pos) return null
            const color    = getNodeColor(nodeId, snapshot)
            const isCurrent = snapshot?.currentNode === nodeId
            const isVisited = snapshot?.visitedNodes?.includes(nodeId)
            const inQueue   = snapshot?.queueNodes?.includes(nodeId)

            return (
              <g key={nodeId}>
                {/* Glow ring for current */}
                {isCurrent && (
                  <circle cx={pos.x} cy={pos.y} r="28" fill="#AAFF0022" stroke="#AAFF0055" strokeWidth="1" />
                )}
                {/* Node circle */}
                <circle
                  cx={pos.x} cy={pos.y} r="22"
                  fill={isCurrent ? '#AAFF00' : isVisited ? '#00FFD122' : 'var(--bg-elevated)'}
                  stroke={isCurrent ? '#AAFF00' : isVisited ? '#00FFD1' : inQueue ? '#A78BFA' : 'var(--border)'}
                  strokeWidth={isCurrent ? '3' : '2'}
                  style={{ transition: 'all 0.3s ease' }}
                />
                {/* Node label */}
                <text
                  x={pos.x} y={pos.y}
                  textAnchor="middle" dominantBaseline="central"
                  fontSize="13" fontWeight="700"
                  fontFamily="Space Mono, monospace"
                  fill={isCurrent ? '#0D0D0D' : isVisited ? '#00FFD1' : 'var(--text-primary)'}
                  style={{ transition: 'fill 0.3s ease' }}
                >
                  {nodeId}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: '16px', flexWrap: 'wrap',
        borderTop: '1px solid var(--border)', paddingTop: '12px',
      }}>
        {[
          ['#AAFF00', 'Current'],
          ['#00FFD1', 'Visited'],
          ['#A78BFA', 'In Queue/Stack'],
          ['var(--bg-elevated)', 'Unvisited'],
        ].map(([color, label]) => (
          <span key={label} style={{
            display: 'flex', alignItems: 'center', gap: '5px',
            fontSize: '10px', color: 'var(--text-muted)',
            fontFamily: 'Space Mono, monospace',
          }}>
            <span style={{
              width: '10px', height: '10px', borderRadius: '50%',
              background: color, display: 'inline-block', flexShrink: 0,
              border: '1px solid var(--border)',
            }} />
            {label}
          </span>
        ))}
      </div>

      {/* Step description */}
      <div style={{ minHeight: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {snapshot?.description ? (
          <>
            <span style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: '#AAFF00', boxShadow: '0 0 6px #AAFF00',
              flexShrink: 0, display: 'inline-block',
            }} />
            <span style={{
              fontSize: '12px', color: 'var(--text-muted)',
              fontFamily: 'Space Mono, monospace',
            }}>
              {snapshot.description}
            </span>
          </>
        ) : (
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
            Press play to start the visualization
          </span>
        )}
      </div>

      {/* Queue/Stack display */}
      {snapshot?.queueNodes?.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '8px 12px', background: 'var(--bg-surface)',
          borderRadius: '8px', border: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontSize: '9px', letterSpacing: '0.15em',
            color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace',
          }}>
            {algorithmName === 'BFS' ? 'QUEUE:' : 'STACK:'}
          </span>
          {snapshot.queueNodes.map((n, i) => (
            <span key={i} style={{
              width: '24px', height: '24px', borderRadius: '6px',
              background: '#A78BFA22', border: '1px solid #A78BFA44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontFamily: 'Space Mono, monospace',
              color: '#A78BFA', fontWeight: 700,
            }}>
              {n}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
