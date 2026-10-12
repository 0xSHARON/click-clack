# click-clack ⌨️

> Satisfying, procedurally synthesized mechanical keyboard audio feedback for web apps.  
> **Zero audio files**, under **2KB minified**, pure Web Audio API acoustics.

[![npm version](https://img.shields.io/npm/v/@0xsharon/click-clack?color=blue&style=flat-square)](https://www.npmjs.com/package/@0xsharon/click-clack)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@0xsharon/click-clack?color=brightgreen&style=flat-square)](https://bundlephobia.com/package/@0xsharon/click-clack)
[![GitHub](https://img.shields.io/badge/GitHub-0xSHARON%2Fclick--clack-black?style=flat-square&logo=github)](https://github.com/0xSHARON/click-clack)
[![license](https://img.shields.io/npm/l/@0xsharon/click-clack?style=flat-square)](./LICENSE)

---

## ⚡ Features

- 🎹 **Zero Audio Files:** No 500KB MP3/WAV assets to load. 100% procedurally synthesized in real-time.
- 🎧 **3D Spatial Stereo Panning:** Keys on the left (`Q, A, Z`) play in your left ear, keys on the right (`P, L, Enter`) play in your right ear. Full headphone immersion!
- 🏎️ **WPM Flow-State Dynamics:** Automatically detects typing speed (WPM) and subtly tightens envelope and pitch as you type faster!
- 🪨 **6 Authentic Switch Acoustics:**
  - `thock` — Deep, lubed tactile/linear mechanical switches (Holy Panda / Topre feel).
  - `creamy` — Viral TikTok custom mechanical keyboard sound (lubed marbly linear switches).
  - `clicky` — Crisp click-leaf with metallic spring resonance (Cherry MX Blue / Kailh Box White).
  - `typewriter` — Heavy steel mechanical typewriter with hollow chamber resonance.
  - `cyberpunk` — 80s retro sci-fi computer terminal key with micro-chirp harmonic.
  - `bubble` — Modern playful UI pop sound.
- 🎛️ **Spacebar & Stabilizer Emulation:** Heavy keys (Spacebar, Enter, Backspace) automatically have specialized acoustic weighting and stabilizer wire acoustics.
- 🎲 **Anti-Machinegun Jitter:** Organic pitch and gain jitter (±4%) prevents repetitive robotic machine-gun effect during fast typing.
- 📱 **Mobile Haptics:** Native support for `navigator.vibrate` tactile micro-pulses on mobile touchscreen devices.
- ⚛️ **First-Class React Hook:** Native `useClickClack` support included.
- 📦 **Dual ESM / CJS & Full TypeScript:** Works everywhere in modern bundlers (Vite, Next.js, Remix, Astro).

---

## 📦 Installation

```bash
npm install @0xsharon/click-clack
# or
pnpm add @0xsharon/click-clack
# or
yarn add @0xsharon/click-clack
```

---

## 🚀 Quick Start

### 1. Vanilla JavaScript / TypeScript

Attach mechanical switch acoustics to any `<textarea>`, `<input>`, or the entire `window`:

```ts
import { attachMechanicalAudio } from '@0xsharon/click-clack';

// Attach to an editor or input
const unsubscribe = attachMechanicalAudio(document.querySelector('#editor'), {
  profile: 'creamy',      // 'thock' | 'creamy' | 'clicky' | 'typewriter' | 'cyberpunk' | 'bubble'
  volume: 0.8,           // 0.0 to 1.0
  stereoPan: true,       // 3D Spatial ear-to-ear panning across keyboard layout
  wpmDynamics: true,     // Flow-state pitch boost when typing fast
  haptic: true,          // Haptic vibration on mobile
  playRelease: true      // Plays softer upstroke reset sound on keyup
});

// Later, teardown when needed:
unsubscribe();
```

### 2. Manual Audio Triggers

Trigger clicks anywhere in your application (buttons, menus, shortcuts):

```ts
import { playSwitch } from '@0xsharon/click-clack';

// Play creamy click on button click
button.addEventListener('click', () => {
  playSwitch({ profile: 'creamy', volume: 0.9 });
});

// Play spacebar stabilizer sound with center pan
playSwitch({ profile: 'thock', key: ' ' });
```

---

## ⚛️ React Integration

Import directly from `@0xsharon/click-clack/react`:

```tsx
import React, { useRef } from 'react';
import { useClickClack } from '@0xsharon/click-clack/react';

export function CodeEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically binds keydown & keyup acoustics with 3D stereo panning
  useClickClack(textareaRef, {
    profile: 'creamy',
    stereoPan: true,
    wpmDynamics: true,
    volume: 0.8
  });

  return (
    <textarea
      ref={textareaRef}
      placeholder="Type to feel the switches..."
    />
  );
}
```

Or enable mechanical sound across the entire browser window:

```tsx
import { useGlobalClickClack } from '@0xsharon/click-clack/react';

export function App() {
  useGlobalClickClack({ profile: 'thock', stereoPan: true, volume: 0.7 });
  return <div id="app">...</div>;
}
```

---

## 🎛️ API Reference

### `attachMechanicalAudio(target, options)`

Binds event listeners to `target` (`HTMLElement | Window | Document`). Returns an `unsubscribe` cleanup function.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `profile` | `SwitchProfile` | `'thock'` | Switch acoustic profile (`'thock'`, `'creamy'`, `'clicky'`, `'typewriter'`, `'cyberpunk'`, `'bubble'`) |
| `volume` | `number` | `0.8` | Master volume (0.0 - 1.0) |
| `stereoPan` | `boolean` | `true` | Enables 3D ear-to-ear spatial panning based on keyboard layout |
| `wpmDynamics` | `boolean` | `false` | Dynamically ramps pitch when typing speed passes 60 WPM |
| `haptic` | `boolean` | `false` | Fires `navigator.vibrate` micro-pulse on mobile devices |
| `playRelease` | `boolean` | `true` | Synthesize release click on `keyup` |
| `filter` | `(e: KeyboardEvent) => boolean` | `undefined` | Optional key filter function |

### `playSwitch(options)`

Plays a one-off synthesized mechanical switch sound.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `profile` | `SwitchProfile` | Active profile | Profile signature |
| `volume` | `number` | `1.0` | Relative volume |
| `pitch` | `number` | `1.0` | Base pitch multiplier |
| `pan` | `number` | `0.0` | Stereo pan position (-1.0 left to 1.0 right) |
| `isRelease` | `boolean` | `false` | True for upstroke reset sound |
| `key` | `string \| KeyRole` | `'standard'` | Key character (e.g., `' '` for Spacebar) |
| `haptic` | `boolean` | `false` | Trigger mobile vibration |

---

## 🎧 Interactive Playground

To try all 6 switch profiles, 3D stereo panning, and the live WPM speedometer locally, open `demo.html` in your browser!

---

## 📄 License

MIT © [0xSHARON](https://github.com/0xSHARON)
