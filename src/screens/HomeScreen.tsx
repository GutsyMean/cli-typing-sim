import { motion } from 'motion/react'
import { useEffect } from 'react'
import { CategoryPicker } from '../components/config/CategoryPicker'
import { ConfigBar } from '../components/config/ConfigBar'
import { OptionsPanel } from '../components/config/OptionsPanel'
import { ThemeGrid } from '../components/config/ThemeGrid'
import { HistoryGraph } from '../components/results/HistoryGraph'
import { KeyHint } from '../components/ui/Kbd'
import { useHistory } from '../history/historyStore'
import { LearnOverview } from '../learn/components/LearnOverview'
import { useSettings } from '../settings/settingsStore'

/** A stenciled crate zone: quoted label, hazard stripe under what matters. */
function Zone({
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
      transition={{ delay, type: 'spring', bounce: 0, visualDuration: 0.35 }}
    >
      <div className="mb-3 flex items-center gap-3">
        <h2 className="quoted text-xl text-nylon sm:text-2xl">{title}</h2>
        <span aria-hidden className="hazard h-2 flex-1" />
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
      <header className="mb-10">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div className="min-w-0">
            <h1 className="text-[clamp(3rem,8.5vw,5rem)] leading-[0.95] font-extrabold tracking-tight text-nylon uppercase">
              &ldquo;termtype&rdquo;
            </h1>
            <p className="mt-3 max-w-[46ch] text-[15px] font-semibold text-nylon">
              &ldquo;muscle memory&rdquo; for the command line.
              <span className="font-normal text-nylon-soft">
                {' '}
                real commands, per-keystroke grading, a mastery course for flags.
              </span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2.5">
            <div className="font-mono text-[10px] text-nylon-soft uppercase">
              № 1979 · workgrade equipment · designed to endure
            </div>
            <motion.button
              type="button"
              onClick={onStart}
              whileTap={{ scale: 0.97 }}
              className="ziptag px-7 py-3.5 text-[15px] shadow-[4px_4px_0_var(--w-nylon)]"
            >
              {learnMode ? '"start learning"' : '"start typing"'}
            </motion.button>
          </div>
        </div>
        <div aria-hidden className="hazard mt-6 h-3.5" />
      </header>

      <div className="flex flex-col gap-10">
        <Zone title="mode">
          <ConfigBar />
        </Zone>

        <Zone title="command sets" delay={0.05}>
          <CategoryPicker />
        </Zone>

        {learnMode && (
          <Zone title="progress" delay={0.075}>
            <LearnOverview />
          </Zone>
        )}

        <Zone title="display" delay={0.1}>
          <ThemeGrid />
        </Zone>

        <Zone title="options" delay={0.15}>
          <OptionsPanel />
        </Zone>

        {!learnMode && (
          <Zone title="record" delay={0.2}>
            <HistoryGraph />
            <HistoryEmptyHint />
          </Zone>
        )}
      </div>

      <footer className="mt-12">
        <div aria-hidden className="hazard h-2" />
        <div className="flex flex-col items-center gap-3 pt-5 pb-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <KeyHint keys={['enter']} label={learnMode ? 'start learning' : 'start'} />
            <span className="text-[13px] text-nylon-soft">
              during a test: <b className="text-nylon">enter</b> runs a command ·{' '}
              <b className="text-nylon">tab+enter</b> restarts ·{' '}
              <b className="text-nylon">esc</b> quits
            </span>
          </div>
          <span className="font-mono text-[10px] text-nylon-soft uppercase">
            &ldquo;materials&rdquo; — commands:{' '}
            <a
              href="https://github.com/tldr-pages/tldr"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-nylon"
            >
              tldr-pages
            </a>{' '}
            (cc by 4.0) · flags:{' '}
            <a
              href="https://github.com/withfig/autocomplete"
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-nylon"
            >
              @withfig/autocomplete
            </a>{' '}
            (isc)
          </span>
        </div>
      </footer>
    </div>
  )
}

function HistoryEmptyHint() {
  const count = useHistory((s) => s.entries.length)
  if (count >= 2) return null
  return (
    <p className="plate px-4 py-6 text-center text-[13px] text-nylon-soft">
      &ldquo;empty&rdquo; — finish your first test and your progress graph hangs here.
    </p>
  )
}
