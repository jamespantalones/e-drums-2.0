// Track specific state

import { signal } from '@preact/signals-react';
import { Config } from '../config';
import { Sequencer } from '../lib/Sequencer';
import { SequencerPlayState } from '../types';
import { Track } from '../lib/Track';

export const SIG_BPM = signal<number>(Config.DEFAULT_BPM);

export const SIG_INITIALIZED = signal<boolean>(false);

// name of track
export const SIG_NAME = signal<string>('');

// playback state
export const SIG_PLAY_STATE = signal<SequencerPlayState>(
  SequencerPlayState.STOPPED_AND_RESET
);

// the current increment
export const SIG_TICK = signal<number>(-1);

// array of tracks
export const SIG_TRACKS = signal<Track[]>([]);
