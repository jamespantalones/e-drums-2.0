// Track specific state

import { signal } from '@preact/signals-react';
import { Config } from '../config';
import { SequencerPlayState, SerializedTrack } from '../types';
import { Track } from '../lib/Track';
import { Sequencer } from '../lib/Sequencer';

export const SIG_BPM = signal<number>(Config.DEFAULT_BPM);

export const SIG_INITIALIZED = signal<boolean>(false);

// name of track
export const SIG_NAME = signal<string>('');

// playback state
export const SIG_PLAY_STATE = signal<SequencerPlayState>(
  SequencerPlayState.STOPPED_AND_RESET
);

export const SIG_SEQUENCER = signal<Sequencer | null>(null);

// the current increment
export const SIG_TICK = signal<number>(-1);

// array of serialized tracks
export const SIG_SERIALIZED_TRACKS = signal<SerializedTrack[]>([]);

// array of audio-enabled tracks
export const SIG_TRACKS = signal<Track[]>([]);
