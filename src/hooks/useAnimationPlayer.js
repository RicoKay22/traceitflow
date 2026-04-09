import { useReducer, useEffect, useRef } from 'react'

/**
 * useAnimationPlayer
 * Manages the step-by-step playback of any algorithm's step snapshots.
 *
 * Usage:
 *   const { state, play, pause, reset, stepForward, stepBack, setSpeed } =
 *     useAnimationPlayer(steps)
 */

const initialState = {
  currentStep: 0,
  isPlaying: false,
  speed: 1.0,          // multiplier: 0.25 | 0.5 | 1 | 2 | 4
  isFinished: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'PLAY':
      return { ...state, isPlaying: true }

    case 'PAUSE':
      return { ...state, isPlaying: false }

    case 'RESET':
      return { ...initialState, speed: state.speed }

    case 'STEP_FORWARD': {
      const next = state.currentStep + 1
      const isFinished = next >= action.totalSteps - 1
      return {
        ...state,
        currentStep: Math.min(next, action.totalSteps - 1),
        isPlaying: isFinished ? false : state.isPlaying,
        isFinished,
      }
    }

    case 'STEP_BACK':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
        isFinished: false,
      }

    case 'SET_SPEED':
      return { ...state, speed: action.speed }

    case 'JUMP_TO':
      return {
        ...state,
        currentStep: action.step,
        isFinished: action.step >= action.totalSteps - 1,
        isPlaying: false,
      }

    default:
      return state
  }
}

// Base interval in ms at 1x speed
const BASE_INTERVAL_MS = 600

export function useAnimationPlayer(steps = []) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const intervalRef = useRef(null)

  // Clear interval helper
  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Auto-advance when playing
  useEffect(() => {
    if (state.isPlaying && !state.isFinished && steps.length > 0) {
      clearTimer()
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'STEP_FORWARD', totalSteps: steps.length })
      }, BASE_INTERVAL_MS / state.speed)
    } else {
      clearTimer()
    }

    return clearTimer
  }, [state.isPlaying, state.speed, state.isFinished, steps.length])

  // Reset when steps array changes (new algorithm selected)
  useEffect(() => {
    dispatch({ type: 'RESET' })
  }, [steps])

  const play       = () => dispatch({ type: 'PLAY' })
  const pause      = () => dispatch({ type: 'PAUSE' })
  const reset      = () => dispatch({ type: 'RESET' })
  const stepForward = () => dispatch({ type: 'STEP_FORWARD', totalSteps: steps.length })
  const stepBack   = () => dispatch({ type: 'STEP_BACK' })
  const setSpeed   = (speed) => dispatch({ type: 'SET_SPEED', speed })
  const jumpTo     = (step) => dispatch({ type: 'JUMP_TO', step, totalSteps: steps.length })

  const currentSnapshot = steps[state.currentStep] ?? null
  const progress = steps.length > 1
    ? Math.round((state.currentStep / (steps.length - 1)) * 100)
    : 0

  return {
    state,
    currentSnapshot,
    progress,
    totalSteps: steps.length,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    setSpeed,
    jumpTo,
  }
}
