import { useEffect, useReducer, useRef, useState } from 'react'
import type { CommandStream } from '../data/generator'
import { useSettings } from '../settings/settingsStore'
import { playClick, playError } from '../lib/sound'
import { classifyKey } from './keys'
import {
  initEngine,
  typingReducer,
  type EngineConfig,
  type EngineState,
} from './typingReducer'

const LOOKAHEAD = 2

export function useTypingEngine(
  stream: CommandStream,
  config: EngineConfig,
  callbacks: { onFinish: (state: EngineState) => void; onRestart: () => void },
) {
  const [state, dispatch] = useReducer(
    typingReducer,
    undefined,
    () =>
      initEngine(
        config.mode === 'commands'
          ? stream.take(config.commandCount)
          : stream.take(1 + LOOKAHEAD),
        config,
      ),
  )
  const [capsLock, setCapsLock] = useState(false)
  const [tabArmed, setTabArmed] = useState(false)
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks
  const finishedRef = useRef(false)

  // Keyboard capture
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      setCapsLock(e.getModifierState('CapsLock'))

      // Restart chords are handled before the engine sees anything.
      if (e.key === 'Escape') {
        e.preventDefault()
        callbacksRef.current.onRestart()
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

      const action = classifyKey(e)
      if (action.kind === 'ignore') {
        if (action.swallow) e.preventDefault()
        return
      }
      e.preventDefault()

      const now = performance.now()
      switch (action.kind) {
        case 'char': {
          dispatch({ type: 'typeChar', char: action.char, now })
          const s = useSettings.getState()
          if (s.soundEnabled) playClick()
          break
        }
        case 'backspace':
          dispatch({ type: 'backspace', now })
          break
        case 'wordBackspace':
          dispatch({ type: 'wordBackspace', now })
          break
        case 'enter':
          dispatch({ type: 'enter', now })
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tabArmed])

  // Error sound reacts to the keystroke log so it fires exactly once per miss.
  const missCount = state.keystrokes.reduce(
    (n, k) => (k.kind === 'char' && !k.correct ? n + 1 : n),
    0,
  )
  const prevMissRef = useRef(0)
  useEffect(() => {
    if (missCount > prevMissRef.current) {
      const s = useSettings.getState()
      if (s.errorSoundEnabled) playError()
    }
    prevMissRef.current = missCount
  }, [missCount])

  // Timed-mode clock
  useEffect(() => {
    if (state.status !== 'running' || config.mode !== 'timed') return
    const id = window.setInterval(
      () => dispatch({ type: 'tick', now: performance.now() }),
      250,
    )
    return () => window.clearInterval(id)
  }, [state.status, config.mode])

  // Timed-mode lookahead: keep lines ahead of the cursor
  useEffect(() => {
    if (config.mode !== 'timed') return
    if (state.lineIndex + LOOKAHEAD >= state.lines.length) {
      dispatch({ type: 'appendLine', entry: stream.next() })
    }
  }, [config.mode, state.lineIndex, state.lines.length, stream])

  // Completion
  useEffect(() => {
    if (state.status === 'finished' && !finishedRef.current) {
      finishedRef.current = true
      callbacksRef.current.onFinish(state)
    }
  }, [state])

  // Abandon-guard: warn before closing the tab mid-test
  useEffect(() => {
    if (state.status !== 'running') return
    const guard = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', guard)
    return () => window.removeEventListener('beforeunload', guard)
  }, [state.status])

  return { state, capsLock, tabArmed }
}
