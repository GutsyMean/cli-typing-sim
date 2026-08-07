import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { LearnSummary } from './learn/learnReducer'
import { HomeScreen } from './screens/HomeScreen'
import { LearnScreen } from './screens/LearnScreen'
import { LearnSummaryScreen } from './screens/LearnSummaryScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { TestScreen, type TestResult } from './screens/TestScreen'
import { applyTheme } from './settings/applyTheme'
import { fontSizeRem, useSettings } from './settings/settingsStore'

type Screen =
  | { name: 'home' }
  | { name: 'test'; seed: number }
  | { name: 'results'; result: TestResult; seed: number }
  | { name: 'learn'; seed: number }
  | { name: 'learnSummary'; summary: LearnSummary; seed: number }

const transition = { type: 'spring', bounce: 0, visualDuration: 0.3 } as const

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  const theme = useSettings((s) => s.theme)
  const fontSize = useSettings((s) => s.fontSize)

  useEffect(() => applyTheme(theme), [theme])
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--terminal-font-size',
      fontSizeRem[fontSize],
    )
  }, [fontSize])

  return (
    <div className="min-h-screen bg-chrome px-4 py-8 sm:px-8 sm:py-12">
      <AnimatePresence mode="wait">
        {screen.name === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
          >
            <HomeScreen
              onStart={() => setScreen({ name: 'test', seed: 1 })}
              onLearn={() => setScreen({ name: 'learn', seed: 1 })}
            />
          </motion.div>
        )}

        {screen.name === 'test' && (
          <motion.div
            key={`test-${screen.seed}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className="pt-6 sm:pt-16"
          >
            <TestScreen
              key={screen.seed}
              onRestart={() => setScreen({ name: 'test', seed: screen.seed + 1 })}
              onExit={() => setScreen({ name: 'home' })}
              onFinish={(result) =>
                setScreen({ name: 'results', result, seed: screen.seed })
              }
            />
          </motion.div>
        )}

        {screen.name === 'learn' && (
          <motion.div
            key={`learn-${screen.seed}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className="pt-6 sm:pt-12"
          >
            <LearnScreen
              key={screen.seed}
              onQuit={() => setScreen({ name: 'home' })}
              onRestart={() => setScreen({ name: 'learn', seed: screen.seed + 1 })}
              onSummary={(summary) =>
                setScreen({ name: 'learnSummary', summary, seed: screen.seed })
              }
            />
          </motion.div>
        )}

        {screen.name === 'learnSummary' && (
          <motion.div
            key="learn-summary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className="pt-4 sm:pt-10"
          >
            <LearnSummaryScreen
              summary={screen.summary}
              onAgain={() => setScreen({ name: 'learn', seed: screen.seed + 1 })}
              onHome={() => setScreen({ name: 'home' })}
            />
          </motion.div>
        )}

        {screen.name === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={transition}
            className="pt-4 sm:pt-10"
          >
            <ResultsScreen
              result={screen.result}
              onNext={() => setScreen({ name: 'test', seed: screen.seed + 1 })}
              onHome={() => setScreen({ name: 'home' })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
