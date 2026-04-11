import * as Slider from '@radix-ui/react-slider'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Play, Pause, RotateCcw, Shuffle, ChevronRight, ChevronLeft, Minus, Plus } from 'lucide-react'

function TipButton({ tip, onClick, disabled, children, variant = 'default' }) {
  return (
    <Tooltip.Provider delayDuration={400}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button onClick={onClick} disabled={disabled} style={{
            width: variant === 'play' ? '48px' : '36px',
            height: variant === 'play' ? '48px' : '36px',
            borderRadius: variant === 'play' ? '12px' : '8px',
            border: variant === 'play' ? 'none' : '1px solid var(--border)',
            background: variant === 'play' ? (disabled ? '#AAFF0055' : '#AAFF00') : 'var(--bg-elevated)',
            color: variant === 'play' ? '#0D0D0D' : 'var(--text-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s ease', flexShrink: 0,
            opacity: disabled && variant !== 'play' ? 0.4 : 1,
            boxShadow: variant === 'play' && !disabled ? '0 0 16px #AAFF0044' : 'none',
          }}
            onMouseEnter={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(-1px)'; if (variant === 'play') e.currentTarget.style.boxShadow = '0 0 24px #AAFF0066'; else e.currentTarget.style.borderColor = '#AAFF0055' } }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; if (variant === 'play') e.currentTarget.style.boxShadow = '0 0 16px #AAFF0044'; else e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            {children}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: '11px', fontFamily: 'Space Mono, monospace', padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} sideOffset={6}>
            {tip}
            <Tooltip.Arrow style={{ fill: 'var(--border)' }} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

// Slider with +/- buttons (21st.dev origin UI style)
function SliderWithButtons({ value, onValueChange, min, max, step, label, displayValue }) {
  const decrease = () => onValueChange(Math.max(min, value - step))
  const increase = () => onValueChange(Math.min(max, value + step))

  const iconBtnStyle = (disabled) => ({
    width: '28px', height: '28px', borderRadius: '7px',
    background: 'var(--bg-elevated)', border: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: disabled ? 'var(--border)' : 'var(--text-muted)',
    flexShrink: 0, transition: 'all 0.15s',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>{label}</span>
        <span style={{ fontSize: '11px', color: '#AAFF00', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>{displayValue}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button style={iconBtnStyle(value <= min)} onClick={decrease} disabled={value <= min}
          onMouseEnter={e => { if (value > min) e.currentTarget.style.borderColor = '#AAFF0055' }}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Minus size={11} />
        </button>

        <Slider.Root value={[value]} onValueChange={([v]) => onValueChange(v)} min={min} max={max} step={step}
          style={{ position: 'relative', display: 'flex', alignItems: 'center', userSelect: 'none', touchAction: 'none', flex: 1, height: '20px' }}>
          <Slider.Track style={{ background: 'var(--border)', position: 'relative', flexGrow: 1, borderRadius: '9999px', height: '4px' }}>
            <Slider.Range style={{ position: 'absolute', background: '#AAFF00', borderRadius: '9999px', height: '100%' }} />
          </Slider.Track>
          <Slider.Thumb style={{ display: 'block', width: '16px', height: '16px', background: '#AAFF00', borderRadius: '9999px', boxShadow: '0 0 8px #AAFF0077', cursor: 'pointer', outline: 'none', transition: 'transform 0.1s, box-shadow 0.1s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.boxShadow = '0 0 14px #AAFF00AA' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 8px #AAFF0077' }}
          />
        </Slider.Root>

        <button style={iconBtnStyle(value >= max)} onClick={increase} disabled={value >= max}
          onMouseEnter={e => { if (value < max) e.currentTarget.style.borderColor = '#AAFF0055' }}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Plus size={11} />
        </button>
      </div>
    </div>
  )
}

const SPEED_VALUES = [0.25, 0.5, 1, 2, 4]
const SPEED_LABELS = { 0.25: '0.25×', 0.5: '0.5×', 1: '1×', 2: '2×', 4: '4×' }

export default function Controls({
  isPlaying, isFinished,
  currentStep, totalSteps,
  speed, onSpeedChange,
  arraySize, onArraySizeChange,
  onPlay, onPause, onReset,
  onStepForward, onStepBack,
  onRandomize,
  isGraph = false,
}) {
  const speedIndex = SPEED_VALUES.indexOf(speed)
  const progress = totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 0

  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)',
      borderRadius: '12px', padding: '16px 20px',
      display: 'flex', flexDirection: 'column', gap: '16px',
    }}>
      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>PROGRESS</span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'Space Mono, monospace' }}>{currentStep} / {Math.max(totalSteps - 1, 0)}</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: isFinished ? 'var(--bar-sorted)' : '#AAFF00', borderRadius: '9999px', transition: 'width 0.2s ease', boxShadow: isFinished ? 'none' : '0 0 8px #AAFF0066' }} />
        </div>
      </div>

      {/* Playback controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <TipButton tip="Step back" onClick={onStepBack} disabled={currentStep === 0}><ChevronLeft size={15} /></TipButton>
        <TipButton tip="Reset" onClick={onReset}><RotateCcw size={14} /></TipButton>
        <TipButton tip={isPlaying ? 'Pause' : isFinished ? 'Replay' : 'Play'} onClick={isPlaying ? onPause : onPlay} variant="play">
          {isPlaying ? <Pause size={20} strokeWidth={2} /> : <Play size={20} strokeWidth={2} style={{ marginLeft: '2px' }} />}
        </TipButton>
        {!isGraph && <TipButton tip="Randomize array" onClick={onRandomize}><Shuffle size={14} /></TipButton>}
        <TipButton tip="Step forward" onClick={onStepForward} disabled={isFinished}><ChevronRight size={15} /></TipButton>
      </div>

      {/* Sliders with +/- buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: isGraph ? '1fr' : '1fr 1fr', gap: '20px', paddingTop: '4px', borderTop: '1px solid var(--border)' }}>
        <SliderWithButtons
          label="SPEED" value={speedIndex}
          onValueChange={i => onSpeedChange(SPEED_VALUES[i])}
          min={0} max={4} step={1}
          displayValue={SPEED_LABELS[speed] || '1×'}
        />
        {!isGraph && (
          <SliderWithButtons
            label="ARRAY SIZE" value={arraySize ?? 30}
            onValueChange={onArraySizeChange}
            min={10} max={80} step={5}
            displayValue={`${arraySize ?? 30}`}
          />
        )}
      </div>

      {isFinished && (
        <div style={{ padding: '8px 12px', borderRadius: '8px', textAlign: 'center', background: '#FFB80011', border: '1px solid #FFB80033', color: '#FFB800', fontSize: '11px', fontFamily: 'Space Mono, monospace', letterSpacing: '0.1em' }}>
          {isGraph ? "✓ TRAVERSAL COMPLETE — Reset to run again" : "✓ SORT COMPLETE — Reset to run again"}
        </div>
      )}
    </div>
  )
}
