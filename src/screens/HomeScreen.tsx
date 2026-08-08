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

/** A molded panel with an engraved label plate riveted to its top edge. */
function Section({
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
      className="bevel-up p-4 sm:p-5"
    >
      <div className="mb-4 flex items-center gap-3">
        <h2 className="bevel-down engraved px-2.5 py-1 text-[10px]">{title}</h2>
        <span aria-hidden className="h-px flex-1 bg-panel-lo/60" />
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
      {/* faceplate masthead */}
      <header className="bevel-up mb-6 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-[26px] tracking-[0.18em] text-ink sm:text-3xl">
                TERMTYPE
              </h1>
              <span className="inline-flex items-center gap-1.5 select-none">
                <span className="font-display text-[8px] tracking-[0.1em] text-ink-faint">
                  PWR
                </span>
                <motion.span
                  aria-hidden
                  className="led led-on"
                  initial={{ opacity: 0.2 }}
                  animate={{ opacity: [0.2, 1, 0.4, 1] }}
                  transition={{ duration: 0.7, times: [0, 0.3, 0.55, 1] }}
                />
              </span>
            </div>
            <p className="mt-1.5 font-sans text-[14px] text-ink-soft">
              muscle memory for the command line
            </p>
          </div>
          <motion.button
            type="button"
            onClick={onStart}
            whileTap={{ y: 2 }}
            className="key-up inline-flex items-center gap-2.5 px-6 py-3"
          >
            <span aria-hidden className="led led-on" />
            <span className="font-display text-[13px] tracking-[0.18em] text-teal-deep">
              {learnMode ? 'START LEARN' : 'START'}
            </span>
          </motion.button>
        </div>
        <div aria-hidden className="service-stripe mt-4 h-1.5" />
        <div className="mt-2 flex justify-between font-display text-[8px] tracking-[0.14em] text-ink-faint select-none">
          <span>INTERACTIVE COMMAND-LINE TRAINER</span>
          <span>CD-ROM EDITION</span>
        </div>
      </header>

      <div className="flex flex-col gap-5">
        <Section title="test program">
          <ConfigBar />
        </Section>

        <Section title="command sets" delay={0.05}>
          <CategoryPicker />
        </Section>

        {learnMode && (
          <Section title="learn progress" delay={0.075}>
            <LearnOverview />
          </Section>
        )}

        <Section title="display" delay={0.1}>
          <ThemeGrid />
        </Section>

        <Section title="options" delay={0.15}>
          <OptionsPanel />
        </Section>

        {!learnMode && (
          <Section title="history" delay={0.2}>
            <HistoryGraph />
            <HistoryEmptyHint />
          </Section>
        )}
      </div>

      <footer className="mt-8 flex flex-col items-center gap-3 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <KeyHint keys={['enter']} label={learnMode ? 'start learning' : 'start'} />
          <span className="font-sans text-[13px] text-ink-faint">
            during a test: <span className="text-ink-soft">enter</span> runs a command ·{' '}
            <span className="text-ink-soft">tab+enter</span> restarts ·{' '}
            <span className="text-ink-soft">esc</span> quits
          </span>
        </div>
        <span className="font-sans text-[11px] text-ink-faint">
          command examples from{' '}
          <a
            href="https://github.com/tldr-pages/tldr"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-panel-lo hover:text-ink-soft"
          >
            tldr-pages
          </a>{' '}
          (CC BY 4.0) · flag descriptions from{' '}
          <a
            href="https://github.com/withfig/autocomplete"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-panel-lo hover:text-ink-soft"
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
    <p className="bevel-down px-4 py-6 text-center font-sans text-[13px] text-ink-faint">
      finish your first test and your progress graph will grow here.
    </p>
  )
}
