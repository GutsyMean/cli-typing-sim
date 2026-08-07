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
        mode: 'learn',
        learnScope: 'commands',
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

// All reads go through the session container's data-* attributes — child
// elements can transiently duplicate during view transitions.
const attr = (name) =>
  page.$eval(
    '[data-learn-phase]',
    (el, n) => el.dataset[n] ?? null,
    name,
  ).catch(() => null)
const phase = () => attr('learnPhase')
const qtype = () => attr('qtype')
const currentUid = () => attr('uid')

async function waitForPhase(name, timeout = 6000) {
  const t0 = Date.now()
  while (Date.now() - t0 < timeout) {
    if ((await phase()) === name) return true
    await page.waitForTimeout(100)
  }
  return false
}

/** Wait until a NEW question is being asked (uid differs from prevUid). */
async function waitForFreshQuestion(prevUid, timeout = 6000) {
  const t0 = Date.now()
  while (Date.now() - t0 < timeout) {
    if ((await phase()) === 'asking' && (await currentUid()) !== prevUid) {
      // let the exiting view finish unmounting so DOM reads hit the new one
      await page.waitForTimeout(350)
      return true
    }
    await page.waitForTimeout(100)
  }
  return false
}

async function answerCurrentCorrectly() {
  const t = await qtype()
  if (t === 'mc' || t === 'flag-mc' || t === 'flag-which') {
    const correct = Number(await attr('correctOption'))
    await page.keyboard.press(String(correct + 1))
  } else {
    const answer = await attr('answer')
    await page.keyboard.type(answer, { delay: 5 })
    await page.keyboard.press('Enter')
  }
}

await page.goto(BASE)
await page.waitForSelector('text=command sets', { timeout: 10_000 })
await page.waitForTimeout(400)

// with mode=learn, the home screen shows the learn dashboard and enter starts
check(
  'learn mode shows start learning button',
  (await page.textContent('body')).includes('start learning'),
)
let opened = false
for (let i = 0; i < 5 && !opened; i++) {
  await page.keyboard.press('Enter')
  opened = await waitForPhase('asking', 1500)
}
check('enter opens a learn session asking mc', opened)
check('first question is multiple choice', (await qtype()) === 'mc')
await page.screenshot({ path: `${SHOTS}/learn-mc.png` })

// wrong mc answer shows feedback and stays level 0
const firstUid = await currentUid()
const correctText = await page.$$eval('[data-option]', (els, i) => els[i]?.textContent ?? '',
  Number(await attr('correctOption')))
const wrongIndex =
  (Number(await attr('correctOption')) + 1) % Number(await attr('optionCount'))
await page.keyboard.press(String(wrongIndex + 1))
check('wrong mc enters feedback', await waitForPhase('feedback'))
// the feedback must show the ANSWERED question, not the next one
check('feedback shows the answered question', (await currentUid()) === firstUid)
// commands with flags get a breakdown panel in feedback
if (/\s-/.test(correctText)) {
  await page.waitForTimeout(400)
  check(
    'flag breakdown shown for flagged command',
    (await page.textContent('body')).includes('flag breakdown'),
  )
}
await page.screenshot({ path: `${SHOTS}/learn-mc-feedback.png` })
// wrong feedback must NOT auto-advance — it waits for the user
await page.waitForTimeout(2200)
check('wrong feedback is sticky', (await phase()) === 'feedback')
check(
  'continue button is shown',
  (await page.$('[data-continue]')) !== null,
)
await page.click('[data-continue]')
check('clicking continue advances', await waitForFreshQuestion(firstUid))

// answer correctly until a cloze appears
let sawCloze = false
for (let i = 0; i < 12 && !sawCloze; i++) {
  const uid = await currentUid()
  await answerCurrentCorrectly()
  if (!(await waitForFreshQuestion(uid))) break
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
  const uid = await currentUid()
  await answerCurrentCorrectly()
  if (!(await waitForFreshQuestion(uid))) break
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

// ---- flags scope: the flag ladder (switch via the study selector UI) ----
const clicked = await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(
    (b) => b.textContent?.trim() === 'flags',
  )
  btn?.click()
  return !!btn
})
check('study selector offers flags', clicked)
await page.waitForTimeout(300)
let flagsOpened = false
for (let i = 0; i < 5 && !flagsOpened; i++) {
  await page.keyboard.press('Enter')
  flagsOpened = await waitForPhase('asking', 1500)
}
check('flags scope opens with a flag question', flagsOpened && (await qtype()) === 'flag-mc')
await page.screenshot({ path: `${SHOTS}/learn-flag-mc.png` })

// promote one flag to flag-which, then flag-recall
let sawWhich = false
for (let i = 0; i < 10 && !sawWhich; i++) {
  const uid = await currentUid()
  await answerCurrentCorrectly()
  if (!(await waitForFreshQuestion(uid))) break
  sawWhich = (await qtype()) === 'flag-which'
}
check('flag promotion reaches meaning question', sawWhich)
if (sawWhich) await page.screenshot({ path: `${SHOTS}/learn-flag-which.png` })

let sawFlagRecall = false
for (let i = 0; i < 16 && !sawFlagRecall; i++) {
  if ((await qtype()) === 'flag-recall') {
    sawFlagRecall = true
    break
  }
  const uid = await currentUid()
  await answerCurrentCorrectly()
  if (!(await waitForFreshQuestion(uid))) break
}
check('flag promotion reaches type-the-flag', sawFlagRecall)
if (sawFlagRecall) {
  const answer = await attr('answer')
  await page.keyboard.type(answer, { delay: 5 })
  await page.keyboard.press('Enter')
  await page.waitForTimeout(300)
  check(
    'typed flag graded correct',
    await page.evaluate(() => document.body.textContent.includes('✓')),
  )
}

await browser.close()
console.log(failures === 0 ? '\nLEARN SMOKE OK' : `\nLEARN SMOKE FAILED (${failures})`)
process.exit(failures === 0 ? 0 : 1)

await browser.close()
console.log(failures === 0 ? '\nLEARN SMOKE OK' : `\nLEARN SMOKE FAILED (${failures})`)
process.exit(failures === 0 ? 0 : 1)
