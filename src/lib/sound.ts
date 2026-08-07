/**
 * Tiny synthesized keyboard sounds via WebAudio — no audio assets needed.
 */
let ctx: AudioContext | null = null

const audio = (): AudioContext | null => {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function blip(freq: number, duration: number, gainPeak: number, type: OscillatorType) {
  const ac = audio()
  if (!ac) return
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(gainPeak, ac.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration)
  osc.connect(gain).connect(ac.destination)
  osc.start()
  osc.stop(ac.currentTime + duration)
}

export const playClick = () => blip(2600, 0.035, 0.045, 'square')
export const playError = () => blip(160, 0.09, 0.09, 'triangle')
export const playDing = () => blip(1320, 0.18, 0.06, 'sine')
