import { describe, expect, it, vi } from 'vitest';
import {
  attachMechanicalAudio,
  calculateKeyPan,
  createSwitchEngine,
  getMasterProfile,
  getMasterVolume,
  playSwitch,
  setMasterProfile,
  setMasterVolume,
} from './index';
import { resolveKeyRole } from './synth';

describe('resolveKeyRole & calculateKeyPan', () => {
  it('correctly identifies standard and special key roles', () => {
    expect(resolveKeyRole('a')).toBe('standard');
    expect(resolveKeyRole(' ')).toBe('space');
    expect(resolveKeyRole('Space')).toBe('space');
    expect(resolveKeyRole('Enter')).toBe('enter');
    expect(resolveKeyRole('Backspace')).toBe('backspace');
    expect(resolveKeyRole('Shift')).toBe('modifier');
    expect(resolveKeyRole('Control')).toBe('modifier');
    expect(resolveKeyRole(undefined)).toBe('standard');
  });

  it('calculates spatial stereo panning by key horizontal position', () => {
    // Left hand keys pan negative
    expect(calculateKeyPan('q')).toBeLessThan(0);
    expect(calculateKeyPan('a')).toBeLessThan(0);
    expect(calculateKeyPan('Tab')).toBeLessThan(0);

    // Center keys are centered
    expect(calculateKeyPan(' ')).toBe(0);
    expect(calculateKeyPan('g')).toBe(0);

    // Right hand keys pan positive
    expect(calculateKeyPan('p')).toBeGreaterThan(0);
    expect(calculateKeyPan('Enter')).toBeGreaterThan(0);
    expect(calculateKeyPan('Backspace')).toBeGreaterThan(0);
  });
});

describe('Audio Settings & SwitchEngine', () => {
  it('updates master volume and clamps values', () => {
    setMasterVolume(0.5);
    expect(getMasterVolume()).toBe(0.5);

    setMasterVolume(1.5);
    expect(getMasterVolume()).toBe(1.0);

    setMasterVolume(-0.5);
    expect(getMasterVolume()).toBe(0.0);
  });

  it('updates and retrieves master switch profile including creamy and cyberpunk', () => {
    setMasterProfile('creamy');
    expect(getMasterProfile()).toBe('creamy');

    setMasterProfile('cyberpunk');
    expect(getMasterProfile()).toBe('cyberpunk');

    setMasterProfile('thock');
    expect(getMasterProfile()).toBe('thock');
  });

  it('creates an isolated SwitchEngine', () => {
    const engine = createSwitchEngine({ profile: 'creamy', volume: 0.7 });
    expect(engine.getProfile()).toBe('creamy');
    expect(engine.getVolume()).toBe(0.7);

    engine.setProfile('bubble');
    expect(engine.getProfile()).toBe('bubble');

    engine.setVolume(0.9);
    expect(engine.getVolume()).toBe(0.9);

    expect(() => engine.play()).not.toThrow();
  });

  it('safe execution of playSwitch with stereo, haptic, and key options', () => {
    expect(() =>
      playSwitch({
        profile: 'creamy',
        key: ' ',
        pan: 0.2,
        haptic: true,
      })
    ).not.toThrow();
  });
});

describe('attachMechanicalAudio DOM listener', () => {
  it('adds and cleans up event listeners on target elements', () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();

    const mockElement = {
      addEventListener: addSpy,
      removeEventListener: removeSpy,
    } as unknown as HTMLElement;

    const cleanup = attachMechanicalAudio(mockElement, {
      profile: 'creamy',
      stereoPan: true,
      wpmDynamics: true,
      playRelease: true,
    });

    expect(addSpy).toHaveBeenCalledTimes(2); // keydown and keyup
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function), { passive: true });
    expect(addSpy).toHaveBeenCalledWith('keyup', expect.any(Function), { passive: true });

    cleanup();

    expect(removeSpy).toHaveBeenCalledTimes(2);
  });

  it('skips keyup listeners when playRelease is false', () => {
    const addSpy = vi.fn();
    const removeSpy = vi.fn();

    const mockElement = {
      addEventListener: addSpy,
      removeEventListener: removeSpy,
    } as unknown as HTMLElement;

    const cleanup = attachMechanicalAudio(mockElement, {
      playRelease: false,
    });

    expect(addSpy).toHaveBeenCalledTimes(1); // keydown only
    cleanup();
    expect(removeSpy).toHaveBeenCalledTimes(1);
  });
});
