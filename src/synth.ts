import { KeyRole, PlaySwitchOptions, SwitchProfile } from './types';

let audioCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;
let masterGain: GainNode | null = null;
let currentProfile: SwitchProfile = 'thock';
let masterVolume = 0.8;

/**
 * Initializes or resumes the Web Audio API context.
 * Modern browsers require user interaction before playing audio.
 */
function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  const AudioContextClass =
    window.AudioContext ||
    // @ts-expect-error - Safari fallback
    window.webkitAudioContext;

  if (!AudioContextClass) return null;

  if (!audioCtx) {
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
    initNoiseBuffer(audioCtx);
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {
      // Ignored if user hasn't interacted yet
    });
  }

  return audioCtx;
}

/**
 * Pre-generate a 1-second white/pink noise buffer for fast micro-burst synthesis.
 */
function initNoiseBuffer(ctx: AudioContext) {
  const bufferSize = ctx.sampleRate; // 1 second
  noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    // Pink noise approximation for warm organic clicks
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    data[i] = (b0 + b1 + b2 + white * 0.5362) * 0.11;
  }
}

/**
 * Identify the acoustic role of a key for tailored acoustics.
 */
export function resolveKeyRole(key?: string | KeyRole): KeyRole {
  if (!key) return 'standard';
  if (typeof key !== 'string') return key;

  const lower = key.toLowerCase();
  if (lower === ' ' || lower === 'space' || lower === 'spacebar') return 'space';
  if (lower === 'enter' || lower === 'return') return 'enter';
  if (lower === 'backspace' || lower === 'delete') return 'backspace';
  if (['shift', 'control', 'alt', 'meta', 'tab', 'capslock'].includes(lower)) return 'modifier';

  return 'standard';
}

/**
 * Procedural synthesizer for "Thock" (lubed tactile/linear mechanical switches).
 */
function synthesizeThock(ctx: AudioContext, dest: AudioNode, now: number, pitchMult: number, isRelease: boolean, role: KeyRole) {
  const isSpace = role === 'space';
  const duration = isRelease ? 0.03 : (isSpace ? 0.09 : 0.06);

  // 1. Bottom-Out Thud Body (Sine with fast pitch envelope)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  const baseFreq = (isSpace ? 110 : (isRelease ? 220 : 160)) * pitchMult;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq * 1.5, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + duration);

  const maxGain = isRelease ? 0.35 : (isSpace ? 1.0 : 0.85);
  oscGain.gain.setValueAtTime(maxGain, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(dest);
  osc.start(now);
  osc.stop(now + duration);

  // 2. Low-Pass Filtered Noise Transient
  if (noiseBuffer) {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isSpace ? 650 * pitchMult : 850 * pitchMult, now);
    filter.frequency.exponentialRampToValueAtTime(180, now + duration);

    const noiseGain = ctx.createGain();
    const noiseVol = isRelease ? 0.2 : (isSpace ? 0.7 : 0.55);
    noiseGain.gain.setValueAtTime(noiseVol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (duration * 0.8));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start(now);
    noise.stop(now + duration);
  }
}

/**
 * Procedural synthesizer for "Clicky" (Cherry MX Blue / Kailh Box White).
 */
function synthesizeClicky(ctx: AudioContext, dest: AudioNode, now: number, pitchMult: number, isRelease: boolean, role: KeyRole) {
  const isSpace = role === 'space';
  const duration = isRelease ? 0.025 : (isSpace ? 0.065 : 0.045);

  // 1. High-frequency click leaf pop (Bandpass noise)
  if (noiseBuffer) {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(3.5, now);
    filter.frequency.setValueAtTime((isRelease ? 3400 : 2800) * pitchMult, now);

    const noiseGain = ctx.createGain();
    const clickVol = isRelease ? 0.4 : 0.85;
    noiseGain.gain.setValueAtTime(clickVol, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isRelease ? 0.015 : 0.022));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start(now);
    noise.stop(now + duration);
  }

  // 2. Metallic Spring Ping (Resonant tone)
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  const pingFreq = (isRelease ? 1200 : 920) * pitchMult;
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(pingFreq, now);
  osc.frequency.exponentialRampToValueAtTime(pingFreq * 0.8, now + duration);

  const pingVol = isRelease ? 0.15 : 0.45;
  oscGain.gain.setValueAtTime(pingVol, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(dest);
  osc.start(now);
  osc.stop(now + duration);

  // 3. Subtle bottom impact for downstroke
  if (!isRelease) {
    const thud = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(isSpace ? 140 : 200, now);
    thud.frequency.exponentialRampToValueAtTime(80, now + duration);

    thudGain.gain.setValueAtTime(0.4, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    thud.connect(thudGain);
    thudGain.connect(dest);
    thud.start(now);
    thud.stop(now + duration);
  }
}

/**
 * Procedural synthesizer for "Typewriter" (Vintage mechanical steel typewriter).
 */
function synthesizeTypewriter(ctx: AudioContext, dest: AudioNode, now: number, pitchMult: number, isRelease: boolean, role: KeyRole) {
  const isSpace = role === 'space';
  const duration = isRelease ? 0.03 : (isSpace ? 0.08 : 0.06);

  // 1. Sharp metallic impact
  const metal = ctx.createOscillator();
  const metalGain = ctx.createGain();

  metal.type = 'sawtooth';
  metal.frequency.setValueAtTime((isRelease ? 1800 : 1400) * pitchMult, now);
  metal.frequency.exponentialRampToValueAtTime(350, now + duration);

  metalGain.gain.setValueAtTime(isRelease ? 0.2 : 0.6, now);
  metalGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  metal.connect(metalGain);
  metalGain.connect(dest);
  metal.start(now);
  metal.stop(now + duration);

  // 2. Hollow mechanical echo
  if (noiseBuffer && !isRelease) {
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1100, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (duration * 0.7));

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start(now);
    noise.stop(now + duration);
  }
}

/**
 * Procedural synthesizer for "Bubble" (Playful modern UI pop).
 */
function synthesizeBubble(ctx: AudioContext, dest: AudioNode, now: number, pitchMult: number, isRelease: boolean, role: KeyRole) {
  if (isRelease) return; // Bubble profile is minimal, skip keyup
  const isSpace = role === 'space';
  const duration = isSpace ? 0.055 : 0.04;

  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  const startFreq = (isSpace ? 480 : 720) * pitchMult;
  const endFreq = (isSpace ? 220 : 360) * pitchMult;

  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  oscGain.gain.setValueAtTime(0.7, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(dest);
  osc.start(now);
  osc.stop(now + duration);
}

/**
 * Main switch sound trigger with humanized jitter & key roles.
 */
export function playSwitch(options: PlaySwitchOptions = {}): void {
  const ctx = getAudioContext();
  if (!ctx || !masterGain) return;

  const profile = options.profile || currentProfile;
  const role = resolveKeyRole(options.key);
  const isRelease = Boolean(options.isRelease);

  // Humanization jitter: subtle organic variation (±4% pitch, ±5% gain)
  const jitter = 0.96 + Math.random() * 0.08;
  const userPitch = options.pitch ?? 1.0;
  const pitchMult = userPitch * jitter;

  // Local gain node for this specific keystroke
  const keyGain = ctx.createGain();
  const baseVol = options.volume ?? 1.0;
  const volJitter = 0.95 + Math.random() * 0.1;
  keyGain.gain.setValueAtTime(Math.min(1.0, Math.max(0, baseVol * volJitter)), ctx.currentTime);
  keyGain.connect(masterGain);

  const now = ctx.currentTime;

  switch (profile) {
    case 'clicky':
      synthesizeClicky(ctx, keyGain, now, pitchMult, isRelease, role);
      break;
    case 'typewriter':
      synthesizeTypewriter(ctx, keyGain, now, pitchMult, isRelease, role);
      break;
    case 'bubble':
      synthesizeBubble(ctx, keyGain, now, pitchMult, isRelease, role);
      break;
    case 'thock':
    default:
      synthesizeThock(ctx, keyGain, now, pitchMult, isRelease, role);
      break;
  }
}

export function setMasterProfile(profile: SwitchProfile): void {
  currentProfile = profile;
}

export function getMasterProfile(): SwitchProfile {
  return currentProfile;
}

export function setMasterVolume(vol: number): void {
  masterVolume = Math.min(1.0, Math.max(0, vol));
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(masterVolume, audioCtx.currentTime);
  }
}

export function getMasterVolume(): number {
  return masterVolume;
}

export function closeAudio(): void {
  if (audioCtx && audioCtx.state !== 'closed') {
    audioCtx.close().catch(() => {});
    audioCtx = null;
    noiseBuffer = null;
    masterGain = null;
  }
}
