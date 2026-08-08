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

/** Every section is its own window on the desktop. */
function WindowSection({
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.18, ease: 'easeOut' }}
      className="window"
    >
      <div className="titlebar">
        <span className="closebox" aria-hidden />
        <span className="titlebar-chip">{title}</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </motion.section>
  )
}

/** 16px pixel terminal mark drawn in the world's own grammar. */
function PixelMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-8" aria-hidden shapeRendering="crispEdges">
      <rect x="0" y="1" width="16" height="14" fill="var(--w-ink)" />
      <rect x="2" y="3" width="12" height="10" fill="var(--w-paper)" />
      <path d="M4 5h2v2H4zM6 7h2v2H6zM4 9h2v2H4z" fill="var(--w-ink)" />
      <rect x="9" y="10" width="4" height="1" fill="var(--w-ink)" />
    </svg>
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
      {/* the title window */}
      <motion.header
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="window mb-6"
      >
        <div className="titlebar">
          <span className="closebox" aria-hidden />
          <span className="titlebar-chip">about this trainer</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 p-5 sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            <PixelMark />
            <div>
              <h1 className="font-display text-3xl leading-none text-ink sm:text-4xl">
                termtype
              </h1>
              <p className="mt-2 text-[13px] text-ink">
                muscle memory for the command line
              </p>
              <p className="mt-0.5 text-[11px] text-ink">
                version 1.0 · 1,900+ commands · 3,500+ flags · one color window
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="btn btn-default px-7 py-2.5 font-display text-[13px] text-ink"
          >
            {learnMode ? 'start learn' : 'start'}
          </button>
        </div>
      </motion.header>

      <div className="flex flex-col gap-7">
        <WindowSection title="test setup">
          <ConfigBar />
        </WindowSection>

        <WindowSection title="command sets" delay={0.04}>
          <CategoryPicker />
        </WindowSection>

        {learnMode && (
          <WindowSection title="learn progress" delay={0.06}>
            <LearnOverview />
          </WindowSection>
        )}

        <WindowSection title="monitors" delay={0.08}>
          <ThemeGrid />
        </WindowSection>

        <WindowSection title="control panel" delay={0.12}>
          <OptionsPanel />
        </WindowSection>

        {!learnMode && (
          <WindowSection title="scrapbook — past tests" delay={0.16}>
            <HistoryGraph />
            <HistoryEmptyHint />
          </WindowSection>
        )}
      </div>

      <footer className="window mt-8 flex flex-col items-center gap-2.5 p-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <KeyHint keys={['enter']} label={learnMode ? 'start learning' : 'start'} />
          <span className="text-[12px] text-ink">
            during a test: <b>enter</b> runs a command · <b>tab+enter</b> restarts ·{' '}
            <b>esc</b> quits
          </span>
        </div>
        <span className="text-[11px] text-ink">
          command examples from{' '}
          <a
            href="https://github.com/tldr-pages/tldr"
            target="_blank"
            rel="noreferrer"
            className="underline hover:font-bold"
          >
            tldr-pages
          </a>{' '}
          (CC BY 4.0) · flag descriptions from{' '}
          <a
            href="https://github.com/withfig/autocomplete"
            target="_blank"
            rel="noreferrer"
            className="underline hover:font-bold"
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
    <p className="border-2 border-dashed border-ink px-4 py-6 text-center text-[13px] text-ink">
      no tests on file — finish your first test and your progress graph is saved here.
    </p>
  )
}
