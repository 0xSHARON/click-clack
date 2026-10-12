# click-clack ⌨️

> Satisfying, procedurally synthesized mechanical keyboard audio feedback for web apps.  
> **Zero audio files**, under **2KB minified**, pure Web Audio API acoustics.

[![npm version](https://img.shields.io/npm/v/click-clack?color=blue&style=flat-square)](https://www.npmjs.com/package/click-clack)
[![bundle size](https://img.shields.io/bundlephobia/minzip/click-clack?color=brightgreen&style=flat-square)](https://bundlephobia.com/package/click-clack)
[![GitHub](https://img.shields.io/badge/GitHub-0xSHARON%2Fclick--clack-black?style=flat-square&logo=github)](https://github.com/0xSHARON/click-clack)
[![license](https://img.shields.io/npm/l/click-clack?style=flat-square)](./LICENSE)

---

## ⚡ Features

- 🎹 **Zero Audio Files:** No 500KB MP3/WAV assets to load. 100% procedurally synthesized in real-time.
- 🪨 **Authentic Switch Acoustics:**
  - `thock` — Deep, lubed tactile/linear mechanical switches (Holy Panda / Topre feel).
  - `clicky` — Crisp click-leaf with metallic spring resonance (Cherry MX Blue / Kailh Box White).
  - `typewriter` — Heavy steel mechanical typewriter with hollow chamber resonance.
  - `bubble` — Modern playful UI pop sound.
- 🎛️ **Spacebar & Stabilizer Emulation:** Heavy keys (Spacebar, Enter, Backspace) automatically have specialized acoustic weighting and stabilizer wire acoustics.
- 🎲 **Anti-Machinegun Jitter:** Organic pitch and gain jitter (±4%) prevents repetitive robotic machine-gun effect during fast typing.
- ⚛️ **First-Class React Hook:** Native `useClickClack` support included.
- 📦 **Dual ESM / CJS & Full TypeScript:** Works everywhere in modern bundlers (Vite, Next.js, Remix, Astro).

---

## 📦 Installation

```bash
npm install click-clack
# or
pnpm add click-clack
# or
yarn add click-clack
```

---

## 🚀 Quick Start

### 1. Vanilla JavaScript / TypeScript

Attach mechanical switch acoustics to any `<textarea>`, `<input>`, or the entire `window`:

```ts
import { attachMechanicalAudio } from 'click-clack';

// Attach to an editor or input
const unsubscribe = attachMechanicalAudio(document.querySelector('#editor'), {
  profile: 'thock',     // 'thock' | 'clicky' | 'typewriter' | 'bubble'
  volume: 0.8,          // 0.0 to 1.0
  playRelease: true     // Plays softer upstroke reset sound on keyup
});

// Later, teardown when needed:
unsubscribe();
```

### 2. Manual Audio Triggers

Trigger clicks anywhere in your application (buttons, menus, shortcuts):

```ts
import { playSwitch } from 'click-clack';

// Play on button click
button.addEventListener('click', () => {
  playSwitch({ profile: 'clicky', volume: 0.9 });
});

// Play spacebar stabilizer sound
playSwitch({ profile: 'thock', key: ' ' });
```

---

## ⚛️ React Integration

Import directly from `click-clack/react`:

```tsx
import React, { useRef } from 'react';
import { useClickClack } from 'click-clack/react';

export function CodeEditor() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Automatically binds keydown & keyup acoustics to this element
  useClickClack(textareaRef, {
    profile: 'thock',
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
import { useGlobalClickClack } from 'click-clack/react';

export function App() {
  useGlobalClickClack({ profile: 'thock', volume: 0.7 });
  return <div id="app">...</div>;
}
```

---

## 🎛️ API Reference

### `attachMechanicalAudio(target, options)`

Binds event listeners to `target` (`HTMLElement | Window | Document`). Returns an `unsubscribe` cleanup function.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `profile` | `'thock' \| 'clicky' \| 'typewriter' \| 'bubble'` | `'thock'` | Switch acoustic profile |
| `volume` | `number` | `0.8` | Master volume (0.0 - 1.0) |
| `playRelease` | `boolean` | `true` | Synthesize release click on `keyup` |
| `filter` | `(e: KeyboardEvent) => boolean` | `undefined` | Optional key filter function |

### `playSwitch(options)`

Plays a one-off synthesized mechanical switch sound.

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `profile` | `SwitchProfile` | Active profile | Profile signature |
| `volume` | `number` | `1.0` | Relative volume |
| `pitch` | `number` | `1.0` | Base pitch multiplier |
| `isRelease` | `boolean` | `false` | True for upstroke reset sound |
| `key` | `string \| KeyRole` | `'standard'` | Key character (e.g., `' '` for Spacebar) |

### `createSwitchEngine(defaultOptions)`

Creates an isolated controller instance with `.play()`, `.setProfile()`, and `.setVolume()` methods.

---

## 🎧 Interactive Playground

To try the sound profiles locally in your browser, open `demo.html` in any browser or launch a local preview server!

---

## 📄 License

MIT © [0xSHARON](https://github.com/0xSHARON)
