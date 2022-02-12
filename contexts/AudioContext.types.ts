import { Track } from '../lib/Track';
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
    deleteTrack: (id: string) => void;
    changeBpm: (bpm: number) => void;
    createTrack: () => void;
    toggleTick: (id: string, index: number) => void;
  }
}


export type AudioContextAction =
  | {
      type: '_INITIALIZE';
    }
  | {
      type: '_PLAY';
    }
  | {
      type: '_STOP';
    }
    | {
      type: 'ADD_TRACK',
      value: Track,
    }
    | {
      type: 'DELETE_TRACK',
      value: string,
    }
  | {
      type: 'INCREMENT_TICK';
      value: number;
    } | {
      type: 'SET_BPM',
      value: number;
    } | {
      type: 'UPDATE_TRACKS',
      value: Track[],
    };