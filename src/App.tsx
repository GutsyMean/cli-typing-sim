import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { ResultsScreen } from './screens/ResultsScreen'
import { TestScreen, type TestResult } from './screens/TestScreen'
import { applyTheme } from './settings/applyTheme'
import { fontSizeRem, useSettings } from './settings/settingsStore'

type Screen =
  | { name: 'home' }
  | { name: 'test'; seed: number }
  | { name: 'results'; result: TestResult; seed: number }

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
            <HomeScreen onStart={() => setScreen({ name: 'test', seed: 1 })} />
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
              onFinish={(result) =>
                setScreen({ name: 'results', result, seed: screen.seed })
              }
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
