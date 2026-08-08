import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { CategoryPicker } from '../components/config/CategoryPicker'
import { ConfigBar } from '../components/config/ConfigBar'
import { OptionsPanel } from '../components/config/OptionsPanel'
import { ThemeGrid } from '../components/config/ThemeGrid'
import { HistoryGraph } from '../components/results/HistoryGraph'
import { KeyHint } from '../components/ui/Kbd'
import { useHistory } from '../history/historyStore'
import { LearnOverview } from '../learn/components/LearnOverview'
import { useSettings } from '../settings/settingsStore'

/** A panel module bolted to the console, with its engraved placard. */
function Module({
  title,
  children,
  delay = 0,
}: {
  title: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', bounce: 0, visualDuration: 0.4 }}
      className="module p-4 pt-3 sm:p-5 sm:pt-3.5"
    >
      <div className="mb-4 flex items-center gap-3 px-4">
        <h2 className="placard text-[10px]">{title}</h2>
        <span aria-hidden className="h-px flex-1 bg-console-edge" />
      </div>
      {children}
    </motion.section>
  )
}

export function HomeScreen({ onStart }: { onStart: () => void }) {
  const learnMode = useSettings((s) => s.mode === 'learn')
  // lamp-test: flash every lens once at power-up
  const [lampTest, setLampTest] = useState(true)
  useEffect(() => {
    const id = window.setTimeout(() => setLampTest(false), 1400)
    return () => window.clearTimeout(id)
  }, [])

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
    <div className={`mx-auto w-full max-w-4xl ${lampTest ? 'lamp-test' : ''}`}>
      {/* the console masthead */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0, visualDuration: 0.4 }}
        className="module mb-6 p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 px-2">
          <div className="min-w-0">
            <h1 className="font-mono text-3xl font-semibold tracking-tight text-legend sm:text-4xl">
              termtype
            </h1>
            <p className="mt-1.5 text-[15px] text-legend-dim">
              muscle memory for the command line
            </p>
            <p className="placard mt-3 text-[9px]">
              unit tt-1979 · 1,900+ commands · 3,500+ flags · operator console
            </p>
          </div>
          <button
            type="button"
            onClick={onStart}
            className={`lens px-8 py-4 text-[14px] font-semibold tracking-[0.14em] uppercase ${
              'lens-lit-run'
            }`}
          >
            {learnMode ? 'run · learn' : 'run'}
          </button>
        </div>
      </motion.header>

      <div className="flex flex-col gap-5">
        <Module title="test program">
          <ConfigBar />
        </Module>

        <Module title="command sets" delay={0.05}>
          <CategoryPicker />
        </Module>

        {learnMode && (
          <Module title="learn progress" delay={0.075}>
            <LearnOverview />
          </Module>
        )}

        <Module title="crt display" delay={0.1}>
          <ThemeGrid />
        </Module>

        <Module title="options" delay={0.15}>
          <OptionsPanel />
        </Module>

        {!learnMode && (
          <Module title="operator log" delay={0.2}>
            <HistoryGraph />
            <HistoryEmptyHint />
          </Module>
        )}
      </div>

      <footer className="mt-8 flex flex-col items-center gap-3 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <KeyHint keys={['enter']} label={learnMode ? 'start learning' : 'start'} />
          <span className="text-[13px] text-legend-dim">
            during a test: <b className="text-legend">enter</b> runs a command ·{' '}
            <b className="text-legend">tab+enter</b> restarts ·{' '}
            <b className="text-legend">esc</b> quits
          </span>
        </div>
        <span className="text-[12px] text-legend-dim">
          command examples from{' '}
          <a
            href="https://github.com/tldr-pages/tldr"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-legend"
          >
            tldr-pages
          </a>{' '}
          (CC BY 4.0) · flag descriptions from{' '}
          <a
            href="https://github.com/withfig/autocomplete"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-legend"
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
    <p className="rounded-sm border border-dashed border-console-edge px-4 py-6 text-center text-[13px] text-legend-dim">
      no runs on the log — finish your first test and your progress graph will grow here.
    </p>
  )
}
