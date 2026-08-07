/**
 * Browser smoke test: drives a full test session end-to-end.
 *
 * Usage:
 *   npm run dev            # in one shell
 *   npm run e2e            # in another
 *
 * Uses the CHROMIUM_PATH env var when set (e.g. a system chromium),
 * otherwise playwright-core's default resolution.
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

// Seed settings: short command-count test so the run is deterministic.
await page.addInitScript(() => {
  localStorage.setItem(
    'termtype:settings:v1',
    JSON.stringify({
      state: {
        mode: 'commands',
        duration: 30,
        commandCount: 10,
        categories: ['bash', 'git', 'docker'],
        difficulties: [1, 2],
        theme: 'dracula',
        promptStyle: 'auto',
        caretStyle: 'block',
        caretBlink: true,
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
})

await page.goto(BASE)
await page.waitForTimeout(1000)
check('home renders', (await page.title()).includes('termtype'))
await page.screenshot({ path: `${SHOTS}/home.png`, fullPage: true })

// Start with Enter, then type all 10 commands (with one corrected typo).
await page.keyboard.press('Enter')
await page.waitForSelector('[data-line="active"]', { timeout: 5000 })
for (let i = 0; i < 10; i++) {
  const cmd = await page.$eval('[data-line="active"]', (el) => el.dataset.cmd)
  if (i === 0) {
    await page.keyboard.type(cmd[0] === 'z' ? 'q' : 'z')
    await page.keyboard.press('Backspace')
  }
  await page.keyboard.type(cmd, { delay: 10 })
  await page.keyboard.press('Enter')
  await page.waitForTimeout(50)
}
await page.waitForTimeout(1600)
await page.screenshot({ path: `${SHOTS}/results.png`, fullPage: true })

const body = await page.textContent('body')
check('results screen shows metrics', body.includes('consistency'))
check('wpm chart rendered', (await page.$$('svg path')).length > 0)

// Enter restarts into a fresh test (after the results grace period).
await page.keyboard.press('Enter')
check(
  'enter starts next test',
  await page
    .waitForSelector('[data-line="active"]', { timeout: 5000 })
    .then(() => true)
    .catch(() => false),
)

// Tab+Enter restarts mid-test.
await page.keyboard.press('Tab')
await page.keyboard.press('Enter')
check(
  'tab+enter restarts test',
  await page
    .waitForSelector('[data-line="active"]', { timeout: 5000 })
    .then(() => true)
    .catch(() => false),
)

// Esc quits back to the config screen.
await page.keyboard.press('Escape')
await page.waitForTimeout(800)
check('esc quits to config', (await page.textContent('body')).includes('command sets'))

await browser.close()
console.log(failures === 0 ? '\nSMOKE OK' : `\nSMOKE FAILED (${failures})`)
process.exit(failures === 0 ? 0 : 1)
