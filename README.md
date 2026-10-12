# click-clack ⌨️

> Satisfying, procedurally synthesized mechanical keyboard audio feedback for web apps.  
> **Zero audio files**, under **2KB minified**, pure Web Audio API acoustics.

[![npm version](https://img.shields.io/npm/v/@0xsharon/click-clack?color=blue&style=flat-square)](https://www.npmjs.com/package/@0xsharon/click-clack)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@0xsharon/click-clack?color=brightgreen&style=flat-square)](https://bundlephobia.com/package/@0xsharon/click-clack)
[![GitHub](https://img.shields.io/badge/GitHub-0xSHARON%2Fclick--clack-black?style=flat-square&logo=github)](https://github.com/0xSHARON/click-clack)
[![license](https://img.shields.io/npm/l/@0xsharon/click-clack?style=flat-square)](./LICENSE)

👉 **[Live Interactive Demo](https://0xsharon.github.io/click-clack/)** — Plug in your headphones and try the switches live in your browser!

---

## ⚡ Features

- 🎹 **Zero Audio Files:** No 500KB MP3/WAV assets to load. 100% procedurally synthesized in real-time.
- 🎧 **3D Spatial Stereo Panning:** Keys on the left (`Q, A, Z`) play in your left ear, keys on the right (`P, L, Enter`) play in your right ear. Full headphone immersion!
- 🏎️ **WPM Flow-State Dynamics:** Automatically detects typing speed (WPM) and subtly tightens envelope and pitch as you type faster!
- 🪵 **Deskmat Acoustic Resonance:** Emulates sound reflection off different surface materials (`'felt'`, `'wood'`, `'metal'`).
- 🔔 **Typewriter Carriage Return Bell:** Optional vintage "DING!" bell when pressing `Enter`.
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
- ⚛️ **Multi-Framework Ecosystem:** Drop-in support for **React**, **Vue 3**, and **Svelte**!
- 📦 **Dual ESM / CJS & Full TypeScript:** Works everywhere in modern bundlers (Vite, Next.js, Remix, Astro, Nuxt, SvelteKit).

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
  deskmat: 'wood',       // 'none' | 'felt' | 'wood' | 'metal'
  carriageBell: true,    // Vintage bell ring on Enter
  playRelease: true      // Plays softer upstroke reset sound on keyup
});

// Later, teardown when needed:
unsubscribe();
```

### 2. Manual Audio Triggers

```ts
import { playSwitch } from '@0xsharon/click-clack';

// Play on button click
button.addEventListener('click', () => {
  playSwitch({ profile: 'creamy', volume: 0.9 });
});

// Play spacebar stabilizer sound
playSwitch({ profile: 'thock', key: ' ' });
```

---

## ⚛️ React Integration

```tsx
import React, { useRef } from 'react';
import { useClickClack } from '@0xsharon/click-clack/react';

export function CodeEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useClickClack(textareaRef, {
    profile: 'creamy',
    stereoPan: true,
    wpmDynamics: true
  });

  return <textarea ref={textareaRef} placeholder="Type to feel the switches..." />;
}
```

---

## 💚 Vue 3 Integration

```html
<script setup>
import { vClickClack } from '@0xsharon/click-clack/vue';
</script>

<template>
  <textarea v-click-clack="{ profile: 'creamy', stereoPan: true }" />
</template>
```

---

## 🧡 Svelte Integration

```svelte
<script>
  import { clickClack } from '@0xsharon/click-clack/svelte';
</script>

<textarea use:clickClack={{ profile: 'creamy', stereoPan: true }} />
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
| `deskmat` | `'none' \| 'felt' \| 'wood' \| 'metal'` | `'none'` | Surface acoustic resonance reflection |
| `carriageBell` | `boolean` | `false` | Synthesize vintage typewriter bell on `Enter` |
| `haptic` | `boolean` | `false` | Fires `navigator.vibrate` micro-pulse on mobile devices |
| `playRelease` | `boolean` | `true` | Synthesize release click on `keyup` |
| `filter` | `(e: KeyboardEvent) => boolean` | `undefined` | Optional key filter function |

---

## 🎧 Interactive Playground

Open `index.html` locally or visit **[https://0xsharon.github.io/click-clack/](https://0xsharon.github.io/click-clack/)**!

---

## 📄 License

MIT © [0xSHARON](https://github.com/0xSHARON)
