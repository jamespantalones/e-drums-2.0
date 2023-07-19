import { Track } from '../lib/Track';

export type TrackAction =
  | {
      method: 'addNote';
      value?: undefined;
    }
  | {
      method: 'removeNote';
      value: number;
    }
  | {
      method: 'changeInstrument';
      value?: SoundFile;
    }
  | { method: 'changeVolume'; value: number }
  | { method: 'changePitch'; value: number }
  | { method: 'setRhythmTicks'; value: number };

export type SequencerAction = {
  method: 'setBpm';
  value: number;
};
export type SoundFile = {
  name: string;
  files: string[];
  defaultFreqRange: [number, number];
};

export type Instrument = {
  sound: SoundFile;
  frequency: number;
};

export type TrackOpts = {
  onNotes?: number;
  totalNotes?: number;
  id?: string;
  pitch?: number;
  color?: string;
  index: number;
  instrument?: Instrument;
  updateSelfInParent: (
    child: Track,
    { needsReconnect }: { needsReconnect?: boolean }
  ) => void;
};

export type AudioContextType = {
  bpm: number;
  initialized: boolean;
  playing: boolean;
  tick: number;
  tracks: Track[];
};

export type AudioContextReturnType = {
  state: AudioContextType;
  dispatch: React.Dispatch<AudioContextAction>;
  initialize: () => Promise<void>;
  methods: {
    play: () => Promise<void>;
    stop: () => void;
    clear: () => void;
    save: () => void;
    deleteTrack: (id: string) => void;
    changeBpm: (bpm: number) => void;
    createTrack: () => void;
    repitchTick: (
      id: string,
      index: number,
      type: 'INCREMENT' | 'DECREMENT'
    ) => void;
    toggleTick: (id: string, index: number) => void;
    setTrackVal: (track: Track, action: TrackAction) => Promise<Track>;
  };
};

export type AudioContextAction =
  | {
      type: 'INITIALIZE';
      value: Track[];
    }
  | {
      type: '_PLAY';
    }
  | {
      type: '_STOP';
    }
  | {
      type: 'ADD_TRACK';
      value: Track;
    }
  | {
      type: 'SAVE';
    }
  | {
      type: 'DELETE_TRACK';
      value: string;
    }
  | {
      type: 'INCREMENT_TICK';
      value: number;
    }
  | {
      type: 'SET_BPM';
      value: number;
    }
  | {
      type: 'UPDATE_TRACKS';
      value: Track[];
    }
  | {
      type: 'UPDATE_TRACK';
      value: Track;
    };

export type SerializedTrack = {
  id: string;
  index: number;
  onNotes: number;
  totalNotes: number;
  pitch: number;
  color: string;
  audio?: SoundFile;
};

export enum SequencerPlayState {
  'STOPPED',
  'STARTED',
}

export enum SequencerEvents {
  SAVE = 'SAVE',
  ADJUST_TIME_SCALE = 'ADJUST_TIME_SCALE',
  TICK = 'TICK',

  ADD_NEW_RHYTHM = 'ADD_NEW_RHYTHM',

  DECREMENT_BEAT = 'DECREMENT_BEAT',
  DECREMENT_TICK = 'DECREMENT_TICK',

  INCREMENT_BEAT = 'INCREMENT_BEAT',

  INCREMENT_TICK = 'INCREMENT_TICK',

  REMOVE_RHYTHM = 'REMOVE_RHYTHM',

  RHYTHM_CHANGE = 'RHYTHM_CHANGE',
  TOGGLE_TICK = 'TOGGLE_TICK',

  FREQUENCY_CHANGE = 'FREQUENCY_CHANGE',
}
