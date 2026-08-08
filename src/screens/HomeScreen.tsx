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

/** Pictograms drawn in one 2.2-stroke grammar, white on the black inset square. */
const pictos: Record<string, React.ReactNode> = {
  test: (
    // stopwatch
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <circle cx="12" cy="13.5" r="7" />
      <path d="M12 13.5V9M10 3h4M17.5 7l1.8-1.8" />
    </g>
  ),
  sets: (
    // stacked crates
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="4" y="4" width="7" height="7" />
      <rect x="13" y="4" width="7" height="7" />
      <rect x="8.5" y="13" width="7" height="7" />
    </g>
  ),
  learn: (
    // route with waypoints
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M5 19c7 0 7-14 14-14" />
      <circle cx="5" cy="19" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="19" cy="5" r="2.2" fill="currentColor" stroke="none" />
    </g>
  ),
  display: (
    // monitor
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <rect x="4" y="5" width="16" height="11" />
      <path d="M9 19.5h6" />
    </g>
  ),
  options: (
    // sliders
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 8h16M4 16h16" />
      <circle cx="10" cy="8" r="2.4" fill="var(--w-board)" />
      <circle cx="15" cy="16" r="2.4" fill="var(--w-board)" />
      <circle cx="10" cy="8" r="2.4" />
      <circle cx="15" cy="16" r="2.4" />
    </g>
  ),
  history: (
    // rising line
    <g fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 18l5-5 3 3 8-8" />
      <path d="M15 8h5v5" />
    </g>
  ),
}

/** A decision point on the concourse: yellow band + the choices beneath it. */
function SignSection({
  picto,
  title,
  note,
  children,
  delay = 0,
}: {
  picto: keyof typeof pictos
  title: string
  note?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: 'spring', bounce: 0, visualDuration: 0.35 }}
    >
      <div className="sign-band sign-hung flex items-center gap-3 px-3.5 py-2 select-none">
        <span className="picto size-8">
          <svg viewBox="0 0 24 24" className="size-5.5">
            {pictos[picto]}
          </svg>
        </span>
        <h2 className="text-[16px] font-bold">{title}</h2>
        {note && <span className="ml-auto hidden text-[12px] font-bold sm:block">{note}</span>}
        <span aria-hidden className={`text-lg leading-none font-bold ${note ? '' : 'ml-auto'}`}>
          →
        </span>
      </div>
      <div className="bg-white p-4 shadow-[0_8px_20px_-12px_rgba(23,24,28,0.35)] sm:p-5">
        {children}
      </div>
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
      {/* the masthead band */}
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', bounce: 0, visualDuration: 0.35 }}
        className="sign-band mb-10 px-5 py-5 sm:px-7"
      >
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex min-w-0 items-center gap-4">
            <span className="picto size-12 sm:size-14">
              {/* keyboard-and-cursor pictogram */}
              <svg viewBox="0 0 24 24" className="size-8 sm:size-9">
                <g fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2.5" y="7" width="19" height="10" />
                  <path d="M5.5 10h1.6M9 10h1.6M12.5 10h1.6M16 10h1.6M7 13.5h10" />
                </g>
              </svg>
            </span>
            <div className="min-w-0">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">termtype</h1>
              <p className="mt-1 text-[15px] font-bold">
                muscle memory for the command line
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onStart}
            className="board group flex items-center gap-3 px-6 py-3.5 text-[16px] font-bold text-white hover:bg-black"
          >
            {learnMode ? 'Start learning' : 'Start typing'}
            <span
              aria-hidden
              className="text-xl leading-none transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t-2 border-board/70 pt-2.5 text-[12px] font-bold">
          <span>1,900+ commands</span>
          <span>3,500+ flags</span>
          <span>15 command sets</span>
          <span>8 displays</span>
          <span className="ml-auto">gate TT-1</span>
        </div>
      </motion.header>

      <div className="flex flex-col gap-10">
        <SignSection picto="test" title="Test" note="decision 1 of 4">
          <ConfigBar />
        </SignSection>

        <SignSection picto="sets" title="Command sets" note="decision 2 of 4" delay={0.05}>
          <CategoryPicker />
        </SignSection>

        {learnMode && (
          <SignSection picto="learn" title="Learn progress" delay={0.075}>
            <LearnOverview />
          </SignSection>
        )}

        <SignSection picto="display" title="Display" note="decision 3 of 4" delay={0.1}>
          <ThemeGrid />
        </SignSection>

        <SignSection picto="options" title="Options" note="decision 4 of 4" delay={0.15}>
          <OptionsPanel />
        </SignSection>

        {!learnMode && (
          <SignSection picto="history" title="Your record" delay={0.2}>
            <HistoryGraph />
            <HistoryEmptyHint />
          </SignSection>
        )}
      </div>

      <footer className="mt-12 flex flex-col items-center gap-3 border-t-4 border-board pt-5 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <KeyHint keys={['enter']} label={learnMode ? 'start learning' : 'start'} />
          <span className="text-[13px] text-board-soft">
            during a test: <b className="text-board">enter</b> runs a command ·{' '}
            <b className="text-board">tab+enter</b> restarts ·{' '}
            <b className="text-board">esc</b> quits
          </span>
        </div>
        <span className="text-[12px] text-board-soft">
          command examples from{' '}
          <a
            href="https://github.com/tldr-pages/tldr"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-board"
          >
            tldr-pages
          </a>{' '}
          (CC BY 4.0) · flag descriptions from{' '}
          <a
            href="https://github.com/withfig/autocomplete"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-board"
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
    <p className="border-2 border-dashed border-hall-line px-4 py-6 text-center text-[13px] text-board-soft">
      no departures yet — finish your first test and your progress graph will grow here.
    </p>
  )
}
