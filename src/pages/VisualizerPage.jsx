import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'
import Sidebar from '../components/layout/Sidebar'
import BarCanvas from '../components/visualizer/BarCanvas'
import Controls from '../components/visualizer/Controls'
import RightDrawer from '../components/layout/RightDrawer'
import { useAnimationPlayer } from '../hooks/useAnimationPlayer'
import { getAlgorithmById } from '../algorithms/index'
import { ArrowLeft, BookOpen, BarChart2, Search, GitBranch } from 'lucide-react'

// ─── Generate random array ────────────────────────────────────
function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
}

const CATEGORY_COLORS = {
  sorting:   '#AAFF00',
  searching: '#00FFD1',
  graph:     '#A78BFA',
}

const CATEGORY_ICONS = {
  sorting:   BarChart2,
  searching: Search,
  graph:     GitBranch,
}

export default function VisualizerPage() {
  const { algorithmId } = useParams()
  const navigate = useNavigate()

  const algorithm = getAlgorithmById(algorithmId)

  const [arraySize, setArraySize] = useState(30)
  const [rawArray, setRawArray] = useState(() => generateArray(30))
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true) // collapsed by default on visualizer
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Pre-compute all steps from the algorithm engine
  const steps = useMemo(() => {
    if (!algorithm) return []
    return algorithm.generateSteps(rawArray)
  }, [algorithm, rawArray])

  const {
    state,
    currentSnapshot,
    progress,
    totalSteps,
    play, pause, reset,
    stepForward, stepBack,
    setSpeed,
  } = useAnimationPlayer(steps)

  const handleRandomize = useCallback(() => {
    const newArr = generateArray(arraySize)
    setRawArray(newArr)
  }, [arraySize])

  const handleArraySizeChange = useCallback((size) => {
    setArraySize(size)
    setRawArray(generateArray(size))
  }, [])

  // 404 — algorithm not found
  if (!algorithm) {
    return (
      <div style={{
        minHeight: '100vh', background: 'var(--bg-base)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: '16px',
      }}>
        <span style={{ fontSize: '48px' }}>🔍</span>
        <h2 style={{
          fontFamily: 'Space Mono, monospace', color: 'var(--text-primary)', fontSize: '20px',
        }}>
          Algorithm not found
        </h2>
        <button onClick={() => navigate('/')} style={{
          padding: '10px 20px', background: '#AAFF00', color: '#0D0D0D',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontFamily: 'Space Mono, monospace', fontSize: '12px', fontWeight: 700,
        }}>
          ← Back to Dashboard
        </button>
      </div>
    )
  }

  const CategoryIcon = CATEGORY_ICONS[algorithm.category] || BarChart2
  const accentColor  = CATEGORY_COLORS[algorithm.category] || '#AAFF00'

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: '100vh', background: 'var(--bg-base)', overflow: 'hidden',
    }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(p => !p)}
        />

        {/* Main visualizer area */}
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: '20px 24px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>

          {/* Sub-header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Back button */}
              <button
                onClick={() => navigate('/')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'transparent', border: '1px solid var(--border)',
                  borderRadius: '8px', padding: '6px 10px',
                  cursor: 'pointer', color: 'var(--text-muted)',
                  fontSize: '12px', fontFamily: 'Space Mono, monospace',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <ArrowLeft size={13} />
                Dashboard
              </button>

              {/* Algorithm name + category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px', height: '30px', borderRadius: '8px',
                  background: accentColor + '18', border: `1px solid ${accentColor}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CategoryIcon size={14} color={accentColor} strokeWidth={1.8} />
                </div>
                <div>
                  <h1 style={{
                    fontFamily: 'Space Mono, monospace', fontSize: '16px',
                    fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1,
                    marginBottom: '2px',
                  }}>
                    {algorithm.name}
                  </h1>
                  <span style={{
                    fontSize: '9px', color: 'var(--text-muted)',
                    fontFamily: 'Space Mono, monospace', letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}>
                    {algorithm.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Open drawer button */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'var(--bg-surface)', border: `1px solid ${accentColor}44`,
                borderRadius: '8px', padding: '7px 12px',
                cursor: 'pointer', color: accentColor,
                fontSize: '11px', fontFamily: 'Space Mono, monospace',
                fontWeight: 700, transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface)'}
            >
              <BookOpen size={13} />
              Pseudocode
            </button>
          </div>

          {/* Bar Canvas */}
          <BarCanvas
            snapshot={currentSnapshot}
            totalElements={arraySize}
            accentColor={accentColor}
          />

          {/* Controls */}
          <Controls
            isPlaying={state.isPlaying}
            isFinished={state.isFinished}
            currentStep={state.currentStep}
            totalSteps={totalSteps}
            speed={state.speed}
            onSpeedChange={setSpeed}
            arraySize={arraySize}
            onArraySizeChange={handleArraySizeChange}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onStepForward={stepForward}
            onStepBack={stepBack}
            onRandomize={handleRandomize}
          />
        </main>
      </div>

      {/* Right Drawer — pseudocode + complexity */}
      <RightDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        algorithm={algorithm}
        currentSnapshot={currentSnapshot}
      />
    </div>
  )
}
