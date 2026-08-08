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

let sectionCounter = 0

function FormSection({
  code,
  title,
  children,
}: {
  code: string
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 * sectionCounter++, type: 'spring', bounce: 0, visualDuration: 0.35 }}
      className="form-rule pt-2"
    >
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="font-sans text-[13px] font-bold tracking-[0.16em] text-ink uppercase">
          {title}
        </h2>
        <span className="font-mono text-[11px] text-ink-soft">{code}</span>
      </div>
      {children}
    </motion.section>
  )
}

export function HomeScreen({ onStart }: { onStart: () => void }) {
  const learnMode = useSettings((s) => s.mode === 'learn')
  sectionCounter = 0

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
      <header className="border-y-[3px] border-ink">
        <div className="flex flex-wrap items-stretch justify-between gap-x-8">
          <div className="min-w-0 py-4">
            <h1 className="headline text-[clamp(3.2rem,9vw,5.5rem)] text-ink">
              termtype
            </h1>
            <p className="mt-2 max-w-[42ch] font-sans text-[15px] leading-snug font-medium text-ink">
              muscle memory for the command line.
              <span className="text-ink-soft">
                {' '}
                real commands, per-keystroke scoring, and a mastery course for
                flags — on the terminal you already use.
              </span>
            </p>
          </div>
          <div className="flex flex-col justify-between gap-3 border-l border-ink/40 py-4 pl-6">
            <div className="fine-print font-mono">
              <div>MODEL NO. TT-1979</div>
              <div>1,900+ COMMANDS · 3,500+ FLAGS</div>
              <div>15 COMMAND SETS · 8 DISPLAY MODES</div>
            </div>
            <motion.button
              type="button"
              onClick={onStart}
              whileTap={{ scale: 0.98 }}
              className="group bg-safety px-6 py-3 text-left font-sans text-[15px] font-bold tracking-wide text-paper-hi uppercase shadow-[3px_3px_0_var(--w-ink)] transition-transform hover:-translate-y-0.5"
            >
              {learnMode ? 'start learning' : 'start typing'}
              <span aria-hidden className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                →
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <p className="mt-2 mb-8 text-right font-sans text-[11px] tracking-[0.2em] text-ink-soft uppercase">
        order form — complete sections A–{learnMode ? 'E' : 'D'}, then press enter
      </p>

      <div className="flex flex-col gap-9">
        <FormSection code="SEC. A" title="test configuration">
          <ConfigBar />
        </FormSection>

        <FormSection code="SEC. B" title="command sets — mark all that apply">
          <CategoryPicker />
        </FormSection>

        {learnMode && (
          <FormSection code="SEC. C" title="course progress">
            <LearnOverview />
          </FormSection>
        )}

        <FormSection code={learnMode ? 'SEC. D' : 'SEC. C'} title="display mode">
          <ThemeGrid />
        </FormSection>

        <FormSection code={learnMode ? 'SEC. E' : 'SEC. D'} title="options">
          <OptionsPanel />
        </FormSection>

        {!learnMode && (
          <FormSection code="FIG. 1" title="operator record">
            <HistoryGraph />
            <HistoryEmptyHint />
          </FormSection>
        )}
      </div>

      <footer className="mt-12 border-t-[3px] border-ink pt-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <KeyHint keys={['enter']} label={learnMode ? 'start learning' : 'start'} />
            <span className="font-sans text-[12px] text-ink-soft">
              in a test: <Em>enter</Em> runs a command · <Em>tab+enter</Em> restarts ·{' '}
              <Em>esc</Em> quits
            </span>
          </div>
          <span className="fine-print">
            command examples from{' '}
            <a
              href="https://github.com/tldr-pages/tldr"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-ink"
            >
              tldr-pages
            </a>{' '}
            (CC BY 4.0) · flag descriptions from{' '}
            <a
              href="https://github.com/withfig/autocomplete"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-ink"
            >
              @withfig/autocomplete
            </a>{' '}
            (ISC)
          </span>
        </div>
      </footer>
    </div>
  )
}

function Em({ children }: { children: React.ReactNode }) {
  return <span className="font-semibold text-ink">{children}</span>
}

function HistoryEmptyHint() {
  const count = useHistory((s) => s.entries.length)
  if (count >= 2) return null
  return (
    <p className="border border-dashed border-ink/40 px-4 py-6 text-center font-sans text-[13px] text-ink-soft">
      no tests on record — finish your first test and your progress graph prints here.
    </p>
  )
}
