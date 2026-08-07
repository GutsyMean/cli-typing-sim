import { motion } from 'motion/react'
import { useEffect } from 'react'
import { CategoryPicker } from '../components/config/CategoryPicker'
import { ConfigBar } from '../components/config/ConfigBar'
import { OptionsPanel } from '../components/config/OptionsPanel'
import { ThemeGrid } from '../components/config/ThemeGrid'
import { HistoryGraph } from '../components/results/HistoryGraph'
import { KeyHint } from '../components/ui/Kbd'
import { useHistory } from '../history/historyStore'

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
    >
      <h2 className="mb-3 font-sans text-[11px] font-semibold tracking-[0.18em] text-faint uppercase">
        {title}
      </h2>
      {children}
    </motion.section>
  )
}

export function HomeScreen({ onStart }: { onStart: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-4xl font-bold text-fg">
            <span className="text-accent">term</span>type
            <motion.span
              aria-hidden
              className="ml-1 inline-block h-8 w-[0.55em] translate-y-1 rounded-[3px] bg-accent"
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1.1, times: [0, 0.45, 0.55, 1], repeat: Infinity }}
            />
          </h1>
          <p className="mt-2 font-sans text-[15px] text-dim">
            muscle memory for the command line — type real commands, monkeytype-style.
          </p>
        </div>
        <motion.button
          type="button"
          onClick={onStart}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-lg bg-accent px-6 py-3 font-sans text-[15px] font-semibold text-term shadow-lg shadow-accent/20"
        >
          start typing
        </motion.button>
      </header>

      <div className="flex flex-col gap-9">
        <Section title="test">
          <ConfigBar />
        </Section>

        <Section title="command sets" delay={0.05}>
          <CategoryPicker />
        </Section>

        <Section title="theme" delay={0.1}>
          <ThemeGrid />
        </Section>

        <Section title="options" delay={0.15}>
          <OptionsPanel />
        </Section>

        <Section title="history" delay={0.2}>
          <HistoryGraph />
          <HistoryEmptyHint />
        </Section>
      </div>

      <footer className="mt-12 flex items-center justify-center gap-6 border-t border-edge pt-6 pb-4">
        <KeyHint keys={['enter']} label="start" />
        <span className="font-sans text-[13px] text-faint">
          during a test: <span className="text-dim">esc</span> restarts ·{' '}
          <span className="text-dim">enter</span> runs a command
        </span>
      </footer>
    </div>
  )
}

function HistoryEmptyHint() {
  const count = useHistory((s) => s.entries.length)
  if (count >= 2) return null
  return (
    <p className="rounded-lg border border-dashed border-edge px-4 py-6 text-center font-sans text-[13px] text-faint">
      finish your first test and your progress graph will grow here.
    </p>
  )
}
