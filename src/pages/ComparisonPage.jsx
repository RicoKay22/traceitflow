import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/layout/TopBar'
import Sidebar from '../components/layout/Sidebar'
import BarCanvas from '../components/visualizer/BarCanvas'
import { useAnimationPlayer } from '../hooks/useAnimationPlayer'
import { ALGORITHMS, getAlgorithmById } from '../algorithms/index'
import * as Switch from '@radix-ui/react-switch'
import * as Slider from '@radix-ui/react-slider'
import * as Tooltip from '@radix-ui/react-tooltip'
import {
  Play, Pause, RotateCcw, Shuffle,
  ArrowLeft, Trophy, Timer, Zap,
} from 'lucide-react'

// ─── Generate shared array ────────────────────────────────────
function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
}

// ─── Format ms to readable time ──────────────────────────────
function formatTime(ms) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

// ─── Algorithm selector ───────────────────────────────────────
function AlgoSelector({ value, onChange, exclude }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: '8px', color: 'var(--text-primary)',
        padding: '7px 12px', fontSize: '12px',
        fontFamily: 'Space Mono, monospace', cursor: 'pointer',
        outline: 'none', width: '100%',
      }}
    >
      {ALGORITHMS.filter(a => a.id !== exclude).map(a => (
        <option key={a.id} value={a.id}>{a.name}</option>
      ))}
    </select>
  )
}

// ─── Single side panel ───────────────────────────────────────
function SidePanelHeader({ algoId, onAlgoChange, otherAlgoId, accentColor, winner, side }) {
  const algo = getAlgorithmById(algoId)
  return (
    <div style={{
      background: 'var(--bg-surface)', border: `1px solid ${winner ? accentColor + '66' : 'var(--border)'}`,
      borderRadius: '12px', padding: '14px 16px',
      boxShadow: winner ? `0 0 20px ${accentColor}22` : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: accentColor, boxShadow: `0 0 6px ${accentColor}`,
          }} />
          <span style={{
            fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-muted)',
            fontFamily: 'Space Mono, monospace',
          }}>
            SIDE {side}
          </span>
        </div>
        {winner && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: accentColor + '22', border: `1px solid ${accentColor}44`,
            borderRadius: '6px', padding: '3px 8px',
          }}>
            <Trophy size={10} color={accentColor} />
            <span style={{ fontSize: '10px', color: accentColor, fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
              WINNER
            </span>
          </div>
        )}
      </div>
      <AlgoSelector value={algoId} onChange={onAlgoChange} exclude={otherAlgoId} />
      {algo && (
        <div style={{ display: 'flex', gap: '4px', marginTop: '8px', flexWrap: 'wrap' }}>
          {Object.entries(algo.complexity).map(([k, v]) => (
            <span key={k} style={{
              fontSize: '9px', padding: '2px 6px', borderRadius: '4px',
              background: 'var(--bg-elevated)', color: 'var(--text-muted)',
              fontFamily: 'Space Mono, monospace', border: '1px solid var(--border)',
            }}>
              {k}: {v}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Compact controls for each side ──────────────────────────
function SideControls({ player, accentColor, finishTime }) {
  const { state, play, pause, reset, stepForward, stepBack } = player

  const btnStyle = (isPrimary) => ({
    width: isPrimary ? '40px' : '30px',
    height: isPrimary ? '40px' : '30px',
    borderRadius: isPrimary ? '10px' : '7px',
    border: isPrimary ? 'none' : '1px solid var(--border)',
    background: isPrimary ? accentColor : 'var(--bg-elevated)',
    color: isPrimary ? '#0D0D0D' : 'var(--text-primary)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', transition: 'all 0.15s',
    boxShadow: isPrimary ? `0 0 12px ${accentColor}44` : 'none',
    flexShrink: 0,
    opacity: state.isFinished && !isPrimary ? 0.5 : 1,
  })

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '6px', padding: '10px 0',
    }}>
      <button style={btnStyle(false)} onClick={stepBack} disabled={state.currentStep === 0}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button style={btnStyle(false)} onClick={reset}>
        <RotateCcw size={12} />
      </button>
      <button style={btnStyle(true)} onClick={state.isPlaying ? pause : play}>
        {state.isPlaying
          ? <Pause size={16} strokeWidth={2} />
          : <Play size={16} strokeWidth={2} style={{ marginLeft: '1px' }} />
        }
      </button>
      <button style={btnStyle(false)} onClick={stepForward} disabled={state.isFinished}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {finishTime !== null && (
        <div style={{
          marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '4px',
          background: accentColor + '18', border: `1px solid ${accentColor}33`,
          borderRadius: '6px', padding: '4px 8px',
        }}>
          <Timer size={10} color={accentColor} />
          <span style={{ fontSize: '10px', color: accentColor, fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
            {formatTime(finishTime)}
          </span>
        </div>
      )}

      {state.isFinished && finishTime === null && (
        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace', marginLeft: '8px' }}>
          ✓ done
        </span>
      )}
    </div>
  )
}

// ─── Main Comparison Page ─────────────────────────────────────
export default function ComparisonPage() {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [algoLeft, setAlgoLeft] = useState('bubbleSort')
  const [algoRight, setAlgoRight] = useState('mergeSort')
  const [arraySize, setArraySize] = useState(25)
  const [sharedArray, setSharedArray] = useState(() => generateArray(25))
  const [speed, setSpeed] = useState(1)
  const [syncPlay, setSyncPlay] = useState(true)

  // Race timer state
  const [raceStartTime, setRaceStartTime] = useState(null)
  const [leftFinishTime, setLeftFinishTime] = useState(null)
  const [rightFinishTime, setRightFinishTime] = useState(null)
  const [liveTimer, setLiveTimer] = useState(0)
  const timerRef = useRef(null)

  const algoLeftDef  = getAlgorithmById(algoLeft)
  const algoRightDef = getAlgorithmById(algoRight)

  const stepsLeft  = useMemo(() => algoLeftDef  ? algoLeftDef.generateSteps(sharedArray)  : [], [algoLeftDef,  sharedArray])
  const stepsRight = useMemo(() => algoRightDef ? algoRightDef.generateSteps(sharedArray) : [], [algoRightDef, sharedArray])

  const playerLeft  = useAnimationPlayer(stepsLeft)
  const playerRight = useAnimationPlayer(stepsRight)

  const SPEED_VALUES = [0.25, 0.5, 1, 2, 4]
  const speedIndex = SPEED_VALUES.indexOf(speed)

  // Sync speed to both players
  useEffect(() => {
    playerLeft.setSpeed(speed)
    playerRight.setSpeed(speed)
  }, [speed])

  // Track finish times
  useEffect(() => {
    if (playerLeft.state.isFinished && leftFinishTime === null && raceStartTime) {
      setLeftFinishTime(Date.now() - raceStartTime)
    }
  }, [playerLeft.state.isFinished])

  useEffect(() => {
    if (playerRight.state.isFinished && rightFinishTime === null && raceStartTime) {
      setRightFinishTime(Date.now() - raceStartTime)
    }
  }, [playerRight.state.isFinished])

  // Live timer
  useEffect(() => {
    const bothFinished = playerLeft.state.isFinished && playerRight.state.isFinished
    const anyPlaying = playerLeft.state.isPlaying || playerRight.state.isPlaying

    if (anyPlaying && !bothFinished) {
      timerRef.current = setInterval(() => {
        setLiveTimer(raceStartTime ? Date.now() - raceStartTime : 0)
      }, 50)
    } else {
      clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [playerLeft.state.isPlaying, playerRight.state.isPlaying, playerLeft.state.isFinished, playerRight.state.isFinished])

  const handleSyncPlay = () => {
    if (!raceStartTime) setRaceStartTime(Date.now())
    else if (playerLeft.state.currentStep === 0 && playerRight.state.currentStep === 0) {
      setRaceStartTime(Date.now())
      setLeftFinishTime(null)
      setRightFinishTime(null)
      setLiveTimer(0)
    }
    playerLeft.play()
    playerRight.play()
  }

  const handleSyncPause = () => {
    playerLeft.pause()
    playerRight.pause()
  }

  const handleSyncReset = useCallback(() => {
    playerLeft.reset()
    playerRight.reset()
    setRaceStartTime(null)
    setLeftFinishTime(null)
    setRightFinishTime(null)
    setLiveTimer(0)
  }, [])

  const handleRandomize = useCallback(() => {
    const arr = generateArray(arraySize)
    setSharedArray(arr)
    handleSyncReset()
  }, [arraySize])

  const handleArraySize = (size) => {
    setArraySize(size)
    setSharedArray(generateArray(size))
    handleSyncReset()
  }

  const bothPlaying = playerLeft.state.isPlaying && playerRight.state.isPlaying
  const anyPlaying  = playerLeft.state.isPlaying || playerRight.state.isPlaying
  const bothFinished = playerLeft.state.isFinished && playerRight.state.isFinished

  const winner = bothFinished
    ? (leftFinishTime !== null && rightFinishTime !== null
        ? (leftFinishTime < rightFinishTime ? 'left' : leftFinishTime > rightFinishTime ? 'right' : 'tie')
        : null)
    : null

  const accentLeft  = algoLeftDef?.accentColor  || '#AAFF00'
  const accentRight = algoRightDef?.accentColor || '#00FFD1'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-base)', overflow: 'hidden' }}>
      <TopBar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(p => !p)} />

        <main style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => navigate('/')} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'transparent', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                color: 'var(--text-muted)', fontSize: '12px',
                fontFamily: 'Space Mono, monospace', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#AAFF00'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <ArrowLeft size={13} /> Dashboard
              </button>
              <div>
                <h1 style={{ fontFamily: 'Space Mono, monospace', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2px' }}>
                  Comparison Mode <span style={{ color: '#AAFF00' }}>⚔</span>
                </h1>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Two algorithms. Same array. Who wins?</p>
              </div>
            </div>

            {/* Live timer */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'var(--bg-surface)', border: '1px solid var(--border)',
              borderRadius: '10px', padding: '8px 14px',
            }}>
              <Timer size={14} color={anyPlaying ? '#AAFF00' : 'var(--text-muted)'} />
              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: '16px', fontWeight: 700,
                color: anyPlaying ? '#AAFF00' : 'var(--text-muted)',
                minWidth: '80px',
              }}>
                {formatTime(liveTimer)}
              </span>
            </div>
          </div>

          {/* Winner banner */}
          {winner && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', textAlign: 'center',
              background: winner === 'tie' ? '#FFB80011' : '#AAFF0011',
              border: `1px solid ${winner === 'tie' ? '#FFB80033' : '#AAFF0033'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}>
              <Trophy size={16} color={winner === 'tie' ? '#FFB800' : '#AAFF00'} />
              <span style={{
                fontFamily: 'Space Mono, monospace', fontSize: '13px', fontWeight: 700,
                color: winner === 'tie' ? '#FFB800' : '#AAFF00',
              }}>
                {winner === 'tie'
                  ? "IT'S A TIE!"
                  : winner === 'left'
                    ? `${algoLeftDef?.name} WINS by ${formatTime(rightFinishTime - leftFinishTime)}!`
                    : `${algoRightDef?.name} WINS by ${formatTime(leftFinishTime - rightFinishTime)}!`
                }
              </span>
            </div>
          )}

          {/* Algo selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <SidePanelHeader
              algoId={algoLeft} onAlgoChange={id => { setAlgoLeft(id); handleSyncReset() }}
              otherAlgoId={algoRight} accentColor={accentLeft}
              winner={winner === 'left'} side="A"
            />
            <SidePanelHeader
              algoId={algoRight} onAlgoChange={id => { setAlgoRight(id); handleSyncReset() }}
              otherAlgoId={algoLeft} accentColor={accentRight}
              winner={winner === 'right'} side="B"
            />
          </div>

          {/* Dual canvas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <BarCanvas snapshot={playerLeft.currentSnapshot} totalElements={arraySize} accentColor={accentLeft} />
              <SideControls player={playerLeft} accentColor={accentLeft} finishTime={leftFinishTime} />
            </div>
            <div>
              <BarCanvas snapshot={playerRight.currentSnapshot} totalElements={arraySize} accentColor={accentRight} />
              <SideControls player={playerRight} accentColor={accentRight} finishTime={rightFinishTime} />
            </div>
          </div>

          {/* Shared controls */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: '12px', padding: '16px 20px',
            display: 'flex', flexDirection: 'column', gap: '14px',
          }}>
            <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>
              SHARED CONTROLS
            </p>

            {/* Sync play row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <Tooltip.Provider delayDuration={400}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button onClick={handleSyncReset} style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s',
                    }}>
                      <RotateCcw size={14} />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '11px', fontFamily: 'Space Mono, monospace', padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border)' }} sideOffset={6}>
                      Reset both
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>

              <button
                onClick={anyPlaying ? handleSyncPause : handleSyncPlay}
                style={{
                  width: '52px', height: '52px', borderRadius: '14px',
                  border: 'none', background: '#AAFF00', color: '#0D0D0D',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 0 20px #AAFF0044',
                  fontFamily: 'Space Mono, monospace',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 30px #AAFF0077'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 20px #AAFF0044'}
              >
                {anyPlaying
                  ? <Pause size={22} strokeWidth={2} />
                  : <Play size={22} strokeWidth={2} style={{ marginLeft: '2px' }} />
                }
              </button>

              <Tooltip.Provider delayDuration={400}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button onClick={handleRandomize} style={{
                      width: '36px', height: '36px', borderRadius: '8px',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--text-muted)', transition: 'all 0.15s',
                    }}>
                      <Shuffle size={14} />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '11px', fontFamily: 'Space Mono, monospace', padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border)' }} sideOffset={6}>
                      New random array
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>

            {/* Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Speed */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>SPEED</span>
                  <span style={{ fontSize: '11px', color: '#AAFF00', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
                    {[0.25, 0.5, 1, 2, 4][speedIndex]}×
                  </span>
                </div>
                <Slider.Root value={[speedIndex]} onValueChange={([i]) => setSpeed(SPEED_VALUES[i])} min={0} max={4} step={1}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', userSelect: 'none', touchAction: 'none', width: '100%', height: '20px' }}>
                  <Slider.Track style={{ background: 'var(--border)', position: 'relative', flexGrow: 1, borderRadius: '9999px', height: '4px' }}>
                    <Slider.Range style={{ position: 'absolute', background: '#AAFF00', borderRadius: '9999px', height: '100%' }} />
                  </Slider.Track>
                  <Slider.Thumb style={{ display: 'block', width: '16px', height: '16px', background: '#AAFF00', borderRadius: '9999px', boxShadow: '0 0 8px #AAFF0077', cursor: 'pointer', outline: 'none' }} />
                </Slider.Root>
              </div>

              {/* Array size */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>ARRAY SIZE</span>
                  <span style={{ fontSize: '11px', color: '#AAFF00', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>{arraySize}</span>
                </div>
                <Slider.Root value={[arraySize]} onValueChange={([v]) => handleArraySize(v)} min={10} max={60} step={5}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', userSelect: 'none', touchAction: 'none', width: '100%', height: '20px' }}>
                  <Slider.Track style={{ background: 'var(--border)', position: 'relative', flexGrow: 1, borderRadius: '9999px', height: '4px' }}>
                    <Slider.Range style={{ position: 'absolute', background: '#AAFF00', borderRadius: '9999px', height: '100%' }} />
                  </Slider.Track>
                  <Slider.Thumb style={{ display: 'block', width: '16px', height: '16px', background: '#AAFF00', borderRadius: '9999px', boxShadow: '0 0 8px #AAFF0077', cursor: 'pointer', outline: 'none' }} />
                </Slider.Root>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
