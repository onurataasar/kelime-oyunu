/**
 * Web Audio API tabanlı ses efektleri — harici dosya gerektirmez.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function resume() {
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
  return c;
}

/** Basit envelope: attack → sustain → release */
function envelope(
  gain: GainNode,
  now: number,
  attack: number,
  sustain: number,
  release: number,
  peakVolume = 0.5,
) {
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(peakVolume, now + attack);
  gain.gain.setValueAtTime(peakVolume, now + attack + sustain);
  gain.gain.linearRampToValueAtTime(0, now + attack + sustain + release);
}

/** Doğru cevap — yükselen iki nota + parıltı */
export function playCorrect() {
  const c = resume();
  const now = c.currentTime;

  [[523, 0], [659, 0.12], [784, 0.24]].forEach(([freq, delay]) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    envelope(gain, now + delay, 0.01, 0.15, 0.25, 0.35);
    osc.start(now + delay);
    osc.stop(now + delay + 0.5);
  });
}

/** Yanlış cevap — alçalan kaba ses */
export function playWrong() {
  const c = resume();
  const now = c.currentTime;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.linearRampToValueAtTime(80, now + 0.4);
  envelope(gain, now, 0.01, 0.2, 0.2, 0.3);
  osc.start(now);
  osc.stop(now + 0.45);
}

/** Harf ipucu — hafif tık */
export function playHint() {
  const c = resume();
  const now = c.currentTime;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
  envelope(gain, now, 0.005, 0.04, 0.06, 0.2);
  osc.start(now);
  osc.stop(now + 0.15);
}

/** Benjamin butonu — mekanik kilitleme sesi */
export function playBenjamin() {
  const c = resume();
  const now = c.currentTime;

  // Düşük "thud"
  const buf = c.createBuffer(1, c.sampleRate * 0.15, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
  }
  const noise = c.createBufferSource();
  noise.buffer = buf;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 200;

  const gain = c.createGain();
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  envelope(gain, now, 0.001, 0.05, 0.1, 0.6);
  noise.start(now);

  // Tık sesi üstüne
  const osc = c.createOscillator();
  const oGain = c.createGain();
  osc.connect(oGain);
  oGain.connect(c.destination);
  osc.type = 'square';
  osc.frequency.value = 120;
  envelope(oGain, now, 0.001, 0.02, 0.05, 0.4);
  osc.start(now);
  osc.stop(now + 0.1);
}

/** Süre uyarısı — tek metronom tık */
export function playTick() {
  const c = resume();
  const now = c.currentTime;

  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.connect(gain);
  gain.connect(c.destination);
  osc.type = 'square';
  osc.frequency.value = 1000;
  envelope(gain, now, 0.001, 0.02, 0.03, 0.15);
  osc.start(now);
  osc.stop(now + 0.06);
}

/** Benjamin süresi doldu — kısa alarm */
export function playBenjaminTimeout() {
  const c = resume();
  const now = c.currentTime;

  [0, 0.15, 0.3].forEach((delay) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = 'square';
    osc.frequency.value = 440;
    envelope(gain, now + delay, 0.001, 0.06, 0.05, 0.2);
    osc.start(now + delay);
    osc.stop(now + delay + 0.12);
  });
}
