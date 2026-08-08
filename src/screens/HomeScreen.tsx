import { motion } from 'motion/react'
import { useEffect } from 'react'
import { CategoryPicker } from '../components/config/CategoryPicker'
import { ConfigBar } from '../components/config/ConfigBar'
import { OptionsPanel } from '../components/config/OptionsPanel'
import { ThemeGrid } from '../components/config/ThemeGrid'
import { HistoryGraph } from '../components/results/HistoryGraph'
import { KeyHint } from '../components/ui/Kbd'
import { StepStrip } from '../components/ui/StepStrip'
import { useHistory } from '../history/historyStore'
import { LearnOverview } from '../learn/components/LearnOverview'
import { useSettings } from '../settings/settingsStore'

/** A silkscreened deck section with its colored index bar. */
function Deck({
  title,
  bar,
  children,
  delay = 0,
}: {
  title: string
  bar: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', bounce: 0, visualDuration: 0.4 }}
      className="deck p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <span aria-hidden className={`h-2.5 w-6 rounded-[2px] ${bar}`} />
        <h2 className="silk text-[10px]">{title}</h2>
        <span aria-hidden className="h-px flex-1 bg-deck-edge" />
      </div>
      {children}
    </motion.section>
  )
}

export function HomeScreen({ onStart }: { onStart: () => void }) {
  const learnMode = useSettings((s) => s.mode === 'learn')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key !== 'Enter') return
      const el = document.activeElement
      if (el && el !== document.body && el.tagName !== 'DIV') return
      e.preventDefault()
      onStart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onStart])

  return (
    <div className="mx-auto w-full max-w-4xl">
      {/* the faceplate */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0, visualDuration: 0.4 }}
        className="deck mb-6 p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
          <div className="min-w-0">
            <h1 className="text-4xl font-bold tracking-tight italic sm:text-5xl">
              termtype
              <span className="silk ml-3 align-middle text-[10px] not-italic">
                model tt-1979
              </span>
            </h1>
            <p className="mt-1 text-[15px] text-silk-dim">
              rhythm composer for the command line — muscle memory in every bar
            </p>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="step flex flex-col items-center gap-1.5 bg-key-red px-8 pt-2.5 pb-3.5 text-[#2a0507]"
          >
            <span aria-hidden className="sled sled-lit" />
            <span className="text-[15px] leading-none font-bold tracking-[0.14em] uppercase">
              {learnMode ? 'start · learn' : 'start'}
            </span>
          </button>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-deck-edge pt-4">
          <StepStrip idle />
          <span className="silk text-[9px]">
            1,900+ commands · 3,500+ flags · 16-step cadence meter
          </span>
        </div>
      </motion.header>

      <div className="flex flex-col gap-5">
        <Deck title="pattern — test program" bar="bg-key-red">
          <ConfigBar />
        </Deck>

        <Deck title="sound banks — command sets" bar="bg-key-yellow" delay={0.05}>
          <CategoryPicker />
        </Deck>

        {learnMode && (
          <Deck title="practice log — learn progress" bar="bg-key-orange" delay={0.075}>
            <LearnOverview />
          </Deck>
        )}

        <Deck title="display" bar="bg-key-orange" delay={0.1}>
          <ThemeGrid />
        </Deck>

        <Deck title="options" bar="bg-key-white" delay={0.15}>
          <OptionsPanel />
        </Deck>

        {!learnMode && (
          <Deck title="session log" bar="bg-key-white" delay={0.2}>
            <HistoryGraph />
            <HistoryEmptyHint />
          </Deck>
        )}
      </div>

      <footer className="mt-8 flex flex-col items-center gap-3 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <KeyHint keys={['enter']} label={learnMode ? 'start learning' : 'start'} />
          <span className="text-[13px] text-silk-dim">
            during a test: <b className="text-silk">enter</b> runs a command ·{' '}
            <b className="text-silk">tab+enter</b> restarts ·{' '}
            <b className="text-silk">esc</b> quits
          </span>
        </div>
        <span className="text-[12px] text-silk-dim">
          command examples from{' '}
          <a
            href="https://github.com/tldr-pages/tldr"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-silk"
          >
            tldr-pages
          </a>{' '}
          (CC BY 4.0) · flag descriptions from{' '}
          <a
            href="https://github.com/withfig/autocomplete"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-silk"
          >
            @withfig/autocomplete
          </a>{' '}
          (ISC)
        </span>
      </footer>
    </div>
  )
}

function HistoryEmptyHint() {
  const count = useHistory((s) => s.entries.length)
  if (count >= 2) return null
  return (
    <p className="rounded-[4px] border border-dashed border-deck-edge px-4 py-6 text-center text-[13px] text-silk-dim">
      no sessions on tape — finish your first test and your progress graph will grow here.
    </p>
  )
}
