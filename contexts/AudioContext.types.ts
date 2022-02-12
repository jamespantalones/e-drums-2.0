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
    changeBpm: (bpm: number) => void;
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
      type: 'INCREMENT_TICK';
    } | {
      type: 'SET_BPM',
      value: number;
    };