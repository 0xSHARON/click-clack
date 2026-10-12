import {
  closeAudio,
  getMasterProfile,
  getMasterVolume,
  playSwitch,
  setMasterProfile,
  setMasterVolume,
} from './synth';
import { AttachOptions, PlaySwitchOptions, SwitchEngine, SwitchProfile } from './types';

export * from './types';
export {
  playSwitch,
  setMasterProfile,
  getMasterProfile,
  setMasterVolume,
  getMasterVolume,
  closeAudio,
};

/**
 * Attaches mechanical keyboard sound synthesis to any DOM element or window.
 *
 * @example
 * ```ts
 * import { attachMechanicalAudio } from 'click-clack';
 *
 * const unsubscribe = attachMechanicalAudio(document.querySelector('textarea'), {
 *   profile: 'thock',
 *   volume: 0.8,
 *   playRelease: true
 * });
 *
 * // Later, when unmounting or cleaning up:
 * unsubscribe();
 * ```
 */
export function attachMechanicalAudio(
  target: Window | Document | HTMLElement | null | undefined,
  options: AttachOptions = {}
): () => void {
  if (!target) {
    return () => {};
  }

  const {
    profile = 'thock',
    volume = 0.8,
    playRelease = true,
    filter,
  } = options;

  const handleKeyDown = (event: Event) => {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent.repeat) return; // Prevent buzzing when key is held down
    if (filter && !filter(kbEvent)) return;

    playSwitch({
      profile,
      volume,
      key: kbEvent.key,
      isRelease: false,
    });
  };

  const handleKeyUp = (event: Event) => {
    if (!playRelease) return;
    const kbEvent = event as KeyboardEvent;
    if (filter && !filter(kbEvent)) return;

    playSwitch({
      profile,
      volume: volume * 0.4, // Keyup sound is softer
      key: kbEvent.key,
      isRelease: true,
    });
  };

  target.addEventListener('keydown', handleKeyDown as EventListener, { passive: true });
  if (playRelease) {
    target.addEventListener('keyup', handleKeyUp as EventListener, { passive: true });
  }

  return () => {
    target.removeEventListener('keydown', handleKeyDown as EventListener);
    if (playRelease) {
      target.removeEventListener('keyup', handleKeyUp as EventListener);
    }
  };
}

/**
 * Creates an isolated or standalone switch engine controller.
 */
export function createSwitchEngine(defaultOptions: PlaySwitchOptions = {}): SwitchEngine {
  let profile = defaultOptions.profile ?? getMasterProfile();
  let volume = defaultOptions.volume ?? getMasterVolume();

  return {
    play: (opts = {}) => {
      playSwitch({
        profile: opts.profile ?? profile,
        volume: opts.volume ?? volume,
        pitch: opts.pitch,
        isRelease: opts.isRelease,
        key: opts.key,
      });
    },
    getProfile: () => profile,
    setProfile: (p: SwitchProfile) => {
      profile = p;
    },
    getVolume: () => volume,
    setVolume: (v: number) => {
      volume = v;
    },
    close: () => {
      closeAudio();
    },
  };
}
