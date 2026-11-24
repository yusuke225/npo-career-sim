// 純 Web Audio API 輕柔爵士電鋼琴合成器（8 小節抒情進行＋空間殘響）

interface ChordVoicing {
  bass: number;
  notes: number[];
  melodyPhrase: [number, number, number];
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// 8 小節溫暖爵士進行：Cmaj9 -> Am9 -> Dm9 -> G13 -> Em9 -> A9 -> Dm9 -> G9sus4
const PROGRESSION: ChordVoicing[] = [
  { bass: 48, notes: [64, 67, 71, 74], melodyPhrase: [76, 79, 83] },
  { bass: 45, notes: [67, 71, 72, 76], melodyPhrase: [79, 76, 74] },
  { bass: 50, notes: [65, 69, 72, 76], melodyPhrase: [77, 79, 81] },
  { bass: 43, notes: [65, 69, 71, 76], melodyPhrase: [79, 74, 76] },
  { bass: 52, notes: [67, 71, 74, 78], melodyPhrase: [83, 81, 79] },
  { bass: 45, notes: [67, 70, 73, 76], melodyPhrase: [76, 74, 73] },
  { bass: 50, notes: [65, 69, 72, 76], melodyPhrase: [74, 76, 79] },
  { bass: 43, notes: [65, 69, 72, 74], melodyPhrase: [76, 74, 72] },
];

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let timerId: number | null = null;
let stepIndex = 0;

function playWarmKey(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  when: number,
  duration: number,
  peakGain: number
) {
  const oscMain = ctx.createOscillator();
  const oscWarm = ctx.createOscillator();
  const oscHarm = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const env = ctx.createGain();

  oscMain.type = 'sine';
  oscMain.frequency.setValueAtTime(freq, when);

  // 極輕微失諧的副振盪器增加電鋼琴厚度與悠長感
  oscWarm.type = 'sine';
  oscWarm.frequency.setValueAtTime(freq * 1.0018, when);

  oscHarm.type = 'triangle';
  oscHarm.frequency.setValueAtTime(freq * 2, when);

  const warmGain = ctx.createGain();
  warmGain.gain.setValueAtTime(0.42, when);

  const harmGain = ctx.createGain();
  harmGain.gain.setValueAtTime(0.11, when);
  harmGain.gain.exponentialRampToValueAtTime(0.01, when + duration * 0.65);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1650, when);
  filter.frequency.exponentialRampToValueAtTime(560, when + duration);

  env.gain.setValueAtTime(0.0001, when);
  env.gain.linearRampToValueAtTime(peakGain, when + 0.05);
  env.gain.exponentialRampToValueAtTime(peakGain * 0.52, when + 0.6);
  env.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  oscMain.connect(filter);
  oscWarm.connect(warmGain);
  warmGain.connect(filter);
  oscHarm.connect(harmGain);
  harmGain.connect(filter);
  filter.connect(env);
  env.connect(dest);

  oscMain.start(when);
  oscWarm.start(when);
  oscHarm.start(when);
  oscMain.stop(when + duration + 0.06);
  oscWarm.stop(when + duration + 0.06);
  oscHarm.stop(when + duration + 0.06);
}

function scheduleBar() {
  if (!audioCtx || !masterGain) return;
  const ctx = audioCtx;
  const dest = masterGain;
  const chord = PROGRESSION[stepIndex % PROGRESSION.length];
  stepIndex += 1;

  const now = ctx.currentTime + 0.06;
  const barSec = 4.2; // 悠長緩板爵士抒情節奏

  // 溫暖低音根音與五度伴奏
  playWarmKey(ctx, dest, midiToFreq(chord.bass), now, barSec * 0.96, 0.25);
  playWarmKey(ctx, dest, midiToFreq(chord.bass + 7), now + barSec * 0.48, barSec * 0.48, 0.12);

  // 爵士九和弦輕柔滾奏
  chord.notes.forEach((midi, idx) => {
    const offset = 0.06 + idx * 0.065;
    playWarmKey(ctx, dest, midiToFreq(midi), now + offset, barSec * 0.85, 0.13);
  });

  // 三音抒情旋律句（帶悠長延音）
  const [m1, m2, m3] = chord.melodyPhrase;
  playWarmKey(ctx, dest, midiToFreq(m1), now + barSec * 0.34, 1.9, 0.115);
  playWarmKey(ctx, dest, midiToFreq(m2), now + barSec * 0.62, 1.6, 0.105);
  if (stepIndex % 2 === 0) {
    playWarmKey(ctx, dest, midiToFreq(m3), now + barSec * 0.84, 1.35, 0.095);
  }
}

export function startJazzBgm(): void {
  if (typeof window === 'undefined') return;
  const AudioCtx =
    window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;

  if (!audioCtx) {
    audioCtx = new AudioCtx();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // 柔和空間迴響（Delay + Lowpass 回授）營造深夜咖啡館鋼琴殘響感
    const delay = audioCtx.createDelay(1.0);
    delay.delayTime.setValueAtTime(0.38, audioCtx.currentTime);
    const echoFilter = audioCtx.createBiquadFilter();
    echoFilter.type = 'lowpass';
    echoFilter.frequency.setValueAtTime(900, audioCtx.currentTime);
    const feedback = audioCtx.createGain();
    feedback.gain.setValueAtTime(0.22, audioCtx.currentTime);
    const wetGain = audioCtx.createGain();
    wetGain.gain.setValueAtTime(0.32, audioCtx.currentTime);

    masterGain.connect(delay);
    delay.connect(echoFilter);
    echoFilter.connect(feedback);
    feedback.connect(delay);
    echoFilter.connect(wetGain);
    wetGain.connect(audioCtx.destination);
  }

  if (audioCtx.state === 'suspended') {
    void audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  masterGain?.gain.cancelScheduledValues(now);
  masterGain?.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now);
  masterGain?.gain.linearRampToValueAtTime(0.38, now + 0.9);

  if (timerId === null) {
    scheduleBar();
    timerId = window.setInterval(scheduleBar, 4200);
  }
}

export function stopJazzBgm(): void {
  if (timerId !== null) {
    window.clearInterval(timerId);
    timerId = null;
  }
  if (audioCtx && masterGain) {
    const now = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(Math.max(0.0001, masterGain.gain.value), now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    const ctxRef = audioCtx;
    window.setTimeout(() => {
      if (timerId === null && ctxRef.state === 'running') {
        void ctxRef.suspend();
      }
    }, 430);
  }
}
