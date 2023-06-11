import { Track } from '../lib/Track';

export enum Library {
  MINIPOPS = 'MINIPOPS',

  TR727 = 'TR727',

  RAVEN = 'RAVEN',
}

export type SoundFile = {
  name: string;
  files: string[];
  defaultFreqRange: [number, number];
};

export type Config = {
  MAX_SLICES: number;
  MAX_TRACKS: number;
  SOUNDS: {
    [key in Library]: SoundFile[];
  };
};

export type CurrentInstrument = {
  parent: SoundFile;
  file: string;
  frequency: number;
};

export type TrackOpts = {
  onNotes: number;
  id?: string;
  totalNotes: number;
  library?: Library;
  pitch?: number;
  color: string;
  index: number;
  currentInstrument?: CurrentInstrument;
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
    save: () => void;
    deleteTrack: (id: string) => void;
    changeBpm: (bpm: number) => void;
    changeLibrary: ({
      track,
      library,
    }: {
      track: Track;
      library: Library;
    }) => void;
    createTrack: () => void;
    toggleTick: (id: string, index: number) => void;
    setRhythmVolume: ({
      track,
      volume,
    }: {
      track: Track;
      volume: number;
    }) => void;
    changeInstrument: ({
      track,
      instrument,
    }: {
      track: Track;
      instrument: SoundFile;
    }) => Promise<Track>;
    setRhythmTicks: ({ track, ticks }: { track: Track; ticks: number }) => void;
    setRhythmPitch: ({ track, pitch }: { track: Track; pitch: number }) => void;
  };
};

export type AudioContextAction =
  | {
      type: 'INITIALIZE';
      value: Track[];
    }
  | {
      type: 'CHANGE_LIBRARY';
      value: Library;
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
  library?: Library;
  instrument?: SoundFile;
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
