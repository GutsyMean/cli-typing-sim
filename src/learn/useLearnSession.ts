import { useEffect, useReducer, useRef, useState } from 'react'
import { classifyKey } from '../engine/keys'
import {
  initLearn,
  isMcType,
  learnReducer,
  summarize,
  type LearnState,
  type LearnSummary,
} from './learnReducer'
import { useLearn, type MasteryLevel } from './learnStore'
import type { QuestionPools } from './questions'
import type { StudyItem } from './studyItems'

const FEEDBACK_MS = { correct: 900, roundComplete: 1800 }
const GRACE_MS = 300

export function useLearnSession(
  items: StudyItem[],
  pools: QuestionPools,
  callbacks: {
    onSummary: (summary: LearnSummary) => void
    onQuit: () => void
    onRestart: () => void
  },
) {
  const [state, dispatch] = useReducer(
    learnReducer,
    undefined,
    () => initLearn(items, pools, useLearn.getState().records, Date.now()),
  )
  const [tabArmed, setTabArmed] = useState(false)
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks
  const stateRef = useRef(state)
  stateRef.current = state
  const summarySentRef = useRef(false)
  const armedAtRef = useRef(0)

  // Keyboard capture — single listener, phase-routed.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const s = stateRef.current
      const phase = s.phase.name

      if (e.key === 'Escape') {
        e.preventDefault()
        if (s.answered.length > 0 && phase !== 'summary') {
          dispatch({ type: 'finish' })
        } else {
          callbacksRef.current.onQuit()
        }
        return
      }
      if (e.key === 'Tab') {
        e.preventDefault()
        setTabArmed(true)
        return
      }
      if (e.key === 'Enter' && tabArmed) {
        e.preventDefault()
        callbacksRef.current.onRestart()
        return
      }
      setTabArmed(false)

      if (phase === 'feedback' || phase === 'recall-diff' || phase === 'round-complete') {
        e.preventDefault()
        if (performance.now() >= armedAtRef.current) dispatch({ type: 'advance' })
        return
      }

      const q = s.queue[0]
      if (phase === 'asking' && q && isMcType(q.qtype)) {
        if (e.key >= '1' && e.key <= '9') {
          e.preventDefault()
          dispatch({ type: 'chooseMc', index: Number(e.key) - 1, now: Date.now() })
        }
        return
      }

      const action = classifyKey(e)
      if (action.kind === 'ignore') {
        if (action.swallow) e.preventDefault()
        return
      }
      e.preventDefault()

      if (phase === 'asking') {
        switch (action.kind) {
          case 'char':
            dispatch({ type: 'inputChar', char: action.char })
            break
          case 'backspace':
            dispatch({ type: 'inputBackspace' })
            break
          case 'wordBackspace':
            dispatch({ type: 'inputWordBackspace' })
            break
          case 'enter':
            dispatch({ type: 'submitInput', now: Date.now() })
            break
        }
      } else if (phase === 'reinforce') {
        switch (action.kind) {
          case 'char':
            dispatch({ type: 'reinforceChar', char: action.char })
            break
          case 'backspace':
            dispatch({ type: 'reinforceBackspace' })
            break
          case 'wordBackspace':
            dispatch({ type: 'reinforceWordBackspace' })
            break
          case 'enter':
            dispatch({ type: 'reinforceEnter' })
            break
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tabArmed])

  // Phase timers: auto-advance feedback and round banners; arm the grace gate.
  const phaseName = state.phase.name
  const phaseCorrect = state.phase.name === 'feedback' ? state.phase.correct : null
  useEffect(() => {
    if (phaseName === 'feedback' || phaseName === 'recall-diff' || phaseName === 'round-complete') {
      armedAtRef.current = performance.now() + GRACE_MS
    }
    // Only CORRECT feedback auto-advances — wrong answers stay on screen
    // until the user continues (keypress or click), so there's time to read
    // what the right answer actually was.
    let delay: number | null = null
    if (phaseName === 'feedback' && phaseCorrect) {
      delay = FEEDBACK_MS.correct
    } else if (phaseName === 'round-complete') {
      delay = FEEDBACK_MS.roundComplete
    }
    if (delay === null) return
    const id = window.setTimeout(() => dispatch({ type: 'advance' }), delay)
    return () => window.clearTimeout(id)
  }, [phaseName, phaseCorrect, state.answered.length])

  // Write-through mastery persistence, idempotent under StrictMode.
  const persistedCountRef = useRef(0)
  useEffect(() => {
    const answered = state.answered
    for (let i = persistedCountRef.current; i < answered.length; i++) {
      const a = answered[i]
      useLearn
        .getState()
        .bump(a.key, (state.levels[a.key] ?? 0) as MasteryLevel, !a.correct)
    }
    persistedCountRef.current = answered.length
  }, [state.answered, state.levels])

  // Reaching summary hands off to the summary screen.
  useEffect(() => {
    if (state.phase.name === 'summary' && !summarySentRef.current) {
      summarySentRef.current = true
      callbacksRef.current.onSummary(summarize(stateRef.current))
    }
  }, [state.phase.name])

  // Warn before closing the tab mid-session.
  const sessionActive = state.answered.length > 0 && state.phase.name !== 'summary'
  useEffect(() => {
    if (!sessionActive) return
    const guard = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', guard)
    return () => window.removeEventListener('beforeunload', guard)
  }, [sessionActive])

  const choose = (index: number) =>
    dispatch({ type: 'chooseMc', index, now: Date.now() })

  const advance = () => {
    if (performance.now() >= armedAtRef.current) dispatch({ type: 'advance' })
  }

  return { state, tabArmed, choose, advance }
}

export type { LearnState }
