export type SwitchProfile = 'clicky' | 'thock' | 'typewriter' | 'bubble';

export type KeyRole = 'standard' | 'space' | 'enter' | 'backspace' | 'modifier';

export interface PlaySwitchOptions {
  /** Switch profile sound signature. Default: 'thock' */
  profile?: SwitchProfile;
  /** Volume multiplier between 0 and 1. Default: 0.8 */
  volume?: number;
  /** Pitch multiplier. 1.0 is default. Default: 1.0 */
  pitch?: number;
  /** Whether this is a key release (upstroke) sound. Default: false */
  isRelease?: boolean;
  /** Key name or KeyRole for tailored acoustics (e.g., Spacebar has stabilizer thud). */
  key?: string | KeyRole;
}

export interface AttachOptions {
  /** Sound profile. Default: 'thock' */
  profile?: SwitchProfile;
  /** Volume between 0 and 1. Default: 0.8 */
  volume?: number;
  /** Play release sound on keyup. Default: true */
  playRelease?: boolean;
  /** Optional custom filter to ignore certain keys. */
  filter?: (event: KeyboardEvent) => boolean;
}

export interface SwitchEngine {
  /** Play an individual mechanical switch sound */
  play: (options?: PlaySwitchOptions) => void;
  /** Current active switch profile */
  getProfile: () => SwitchProfile;
  /** Change active profile */
  setProfile: (profile: SwitchProfile) => void;
  /** Get current master volume */
  getVolume: () => number;
  /** Set master volume */
  setVolume: (volume: number) => void;
  /** Stop or mute audio context */
  close: () => void;
}
