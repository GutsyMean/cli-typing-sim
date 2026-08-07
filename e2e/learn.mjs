/**
 * Learn-mode smoke test: drives the mastery ladder end-to-end.
 *
 * Usage: npm run dev (one shell) then npm run e2e:learn (another).
 * CHROMIUM_PATH env var overrides the browser binary.
 */
import { chromium } from 'playwright-core'
import { mkdirSync } from 'node:fs'

const BASE = process.env.E2E_BASE_URL ?? 'http://localhost:5173'
const SHOTS = new URL('./shots/', import.meta.url).pathname
mkdirSync(SHOTS, { recursive: true })

const launchOptions = process.env.CHROMIUM_PATH
  ? { executablePath: process.env.CHROMIUM_PATH }
  : {}

let failures = 0
const check = (label, ok) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`)
  if (!ok) failures++
}

const browser = await chromium.launch(launchOptions)
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
page.on('pageerror', (e) => {
  console.log('PAGE ERROR:', e.message)
  failures++
})

await page.addInitScript(() => {
  localStorage.setItem(
    'termtype:settings:v1',
    JSON.stringify({
      state: {
        mode: 'commands',
        duration: 30,
        commandCount: 10,
        categories: ['bash'],
        difficulties: [1],
        theme: 'dracula',
        promptStyle: 'auto',
        caretStyle: 'block',
        caretBlink: false,
        fontSize: 'md',
        soundEnabled: false,
        errorSoundEnabled: false,
        behavior: 'forgiving',
        showLiveStats: true,
        showDescriptions: true,
      },
      version: 0,
    }),
  )
  localStorage.removeItem('termtype:learn:v1')
})

const phase = () =>
  page.$eval('[data-learn-phase]', (el) => el.dataset.learnPhase).catch(() => null)
const qtype = () =>
  page.$eval('[data-qtype]', (el) => el.dataset.qtype).catch(() => null)

async function waitForPhase(name, timeout = 6000) {
  const t0 = Date.now()
  while (Date.now() - t0 < timeout) {
    if ((await phase()) === name) return true
    await page.waitForTimeout(100)
  }
  return false
}

async function answerCurrentCorrectly() {
  const t = await qtype()
  if (t === 'mc') {
    const correct = await page.$eval(
      '[data-option][data-correct="true"]',
      (el) => Number(el.dataset.option),
    )
    await page.keyboard.press(String(correct + 1))
  } else {
    const answer = await page.$eval('[data-qtype]', (el) => el.dataset.answer)
    await page.keyboard.type(answer, { delay: 5 })
    await page.keyboard.press('Enter')
  }
}

await page.goto(BASE)
await page.waitForSelector('text=command sets', { timeout: 10_000 })
await page.waitForTimeout(400)

// 'l' starts learn mode on an mc question (retry in case mount is slow)
let opened = false
for (let i = 0; i < 5 && !opened; i++) {
  await page.keyboard.press('l')
  opened = await waitForPhase('asking', 1500)
}
check('l opens learn mode asking mc', opened)
check('first question is multiple choice', (await qtype()) === 'mc')
await page.screenshot({ path: `${SHOTS}/learn-mc.png` })

// wrong mc answer shows feedback and stays level 0
const wrongIndex = await page.$eval(
  '[data-option][data-correct="false"]',
  (el) => Number(el.dataset.option),
)
await page.keyboard.press(String(wrongIndex + 1))
check('wrong mc enters feedback', await waitForPhase('feedback'))
await page.screenshot({ path: `${SHOTS}/learn-mc-feedback.png` })
check('feedback auto-advances', await waitForPhase('asking'))

// answer correctly until a cloze appears
let sawCloze = false
for (let i = 0; i < 12 && !sawCloze; i++) {
  await answerCurrentCorrectly()
  const ok = await waitForPhase('asking')
  if (!ok) break
  sawCloze = (await qtype()) === 'cloze'
}
check('promotion reaches a cloze question', sawCloze)
if (sawCloze) await page.screenshot({ path: `${SHOTS}/learn-cloze.png` })

// answer correctly until a recall appears, then fail it on purpose
let sawRecall = false
for (let i = 0; i < 20 && !sawRecall; i++) {
  if ((await qtype()) === 'recall') {
    sawRecall = true
    break
  }
  await answerCurrentCorrectly()
  if (!(await waitForPhase('asking'))) break
}
check('promotion reaches full recall', sawRecall)

if (sawRecall) {
  await page.keyboard.type('totally wrong answer', { delay: 5 })
  await page.keyboard.press('Enter')
  check('wrong recall shows the diff', await waitForPhase('recall-diff'))
  await page.screenshot({ path: `${SHOTS}/learn-recall-diff.png` })
  await page.waitForTimeout(400)
  await page.keyboard.press(' ')
  check('any key moves to reinforce', await waitForPhase('reinforce'))
  await page.waitForSelector('[data-reinforce]', { timeout: 5000 })
  await page.screenshot({ path: `${SHOTS}/learn-reinforce.png` })
  const target = await page.$eval('[data-reinforce]', (el) => el.dataset.answer)
  // enter before typing must not advance
  await page.keyboard.press('Enter')
  check('reinforce gates on typing', (await phase()) === 'reinforce')
  await page.keyboard.type(target, { delay: 5 })
  await page.keyboard.press('Enter')
  check('clean copy-type returns to asking', await waitForPhase('asking'))
}

// esc finishes with a summary
await page.keyboard.press('Escape')
await page.waitForTimeout(900)
const body = await page.textContent('body')
check('summary shows mastered count', body.includes('commands mastered'))
await page.screenshot({ path: `${SHOTS}/learn-summary.png`, fullPage: true })

// mastery persisted
const persisted = await page.evaluate(() => localStorage.getItem('termtype:learn:v1'))
check(
  'mastery persisted to localStorage',
  !!persisted && Object.keys(JSON.parse(persisted).state.records).length > 0,
)

// esc returns home
await page.keyboard.press('Escape')
await page.waitForTimeout(800)
check('esc returns to config', (await page.textContent('body')).includes('command sets'))

await browser.close()
console.log(failures === 0 ? '\nLEARN SMOKE OK' : `\nLEARN SMOKE FAILED (${failures})`)
process.exit(failures === 0 ? 0 : 1)
