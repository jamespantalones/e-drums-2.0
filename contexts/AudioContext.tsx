import { Sequencer } from '../lib/Sequencer';
import { Track } from '../lib/Track';
import {
  AudioContextReturnType,
  SerializedSequencer,
  TrackAction,
} from '../types';
import { audioContextReducer } from './AudioContext.reducer';
import * as Tone from 'tone';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { generateTrack } from '../lib/utils';
import { Config } from '../config';

/**
 * Main goal of this AudioContext is
 * to provide singular set of UI operation
 * which in turn, update the underlying audio sequencer
 */
const AudioContext = createContext<AudioContextReturnType | undefined>(
  undefined
);

export function AudioContextProvider({ children }: { children: ReactNode }) {
  // audio state
  const [state, dispatch] = useReducer(audioContextReducer, {
    bpm: Config.DEFAULT_BPM,
    initialized: false,
    playing: false,
    tick: -1,
    tracks: [],
  });

  /**
   * Holds local ref to sequencer class instance
   */
  const seq = useRef<Sequencer>();

  /**
   * when we receive a message from the sequencer
   * update the tick in the UI
   */
  const incrementTick = useCallback((tick: number) => {
    dispatch({ type: 'INCREMENT_TICK', value: tick });
  }, []);

  // make sure the AudioContext is initialized
  const initialize = useCallback(
    async (data?: SerializedSequencer) => {
      try {
        if (data) {
          dispatch({ type: 'SET_BPM', value: data.bpm });
          seq.current = new Sequencer({
            ...data,
            initialTracks: data.state.tracks,
            bpm: data.bpm,
            // TODO Fix
            id: 'asdf',
            onTick: incrementTick,
          });
        } else {
          seq.current = new Sequencer({
            onTick: incrementTick,
            bpm: Config.DEFAULT_BPM,
            initialTracks: [generateTrack(0)],
            id: 'asdf',
          });
        }

        const s = await seq.current.init();

        dispatch({ type: 'INITIALIZE', value: s.state.tracks });
      } catch (err) {
        console.log(err);
      }
    },
    [incrementTick]
  );

  /**
   * Starts playback
   */
  const play = useCallback(async () => {
    if (seq.current && !seq.current.isInit) {
      await seq.current.init();
    }

    // start the AudioContext engine (on user interactive only)
    seq.current?.start();
    dispatch({ type: '_PLAY' });
  }, []);

  /**
   * Stops playback
   */
  const stop = useCallback(async () => {
    seq.current?.stop();
    dispatch({ type: '_STOP' });
  }, []);

  const createTrack = useCallback(async () => {
    // add to Sequencer
    const track = await seq.current?.addNewRhythm(
      generateTrack(state.tracks.length)
    );

    if (track) {
      // add to state
      dispatch({ type: 'ADD_TRACK', value: track });
    }
  }, [state.tracks]);

  const repitchTick = useCallback(
    (id: string, index: number, type: 'INCREMENT' | 'DECREMENT') => {
      if (seq.current) {
        const [_track, tracks] = seq.current.repitchTick(id, index, type);

        // update in state
        dispatch({ type: 'UPDATE_TRACKS', value: tracks || [] });
      }
    },
    []
  );

  const toggleTick = useCallback((id: string, index: number) => {
    if (seq.current) {
      const [_track, tracks] = seq.current.toggleTick(id, index);

      // update in state
      dispatch({ type: 'UPDATE_TRACKS', value: tracks });
    }
    // update in sequencer
  }, []);

  const setTrackVal = useCallback(
    async (track: Track, action: TrackAction): Promise<Track> => {
      if (!track[action.method]) {
        throw new Error(`${action.method} not implemented on Track`);
      }
      const v = await track[action.method](action.value as any);
      dispatch({ type: 'UPDATE_TRACK', value: v });
      return v;
    },
    []
  );

  const clear = useCallback(() => {
    seq.current?.clear();
  }, []);

  const changeBpm = useCallback((bpm: number) => {
    dispatch({ type: 'SET_BPM', value: bpm });
  }, []);

  const decrementBpm = useCallback(() => {
    dispatch({ type: 'DECREMENT_BPM' });
  }, []);

  const incrementBpm = useCallback(() => {
    dispatch({ type: 'INCREMENT_BPM' });
  }, []);

  const deleteTrack = useCallback(
    (id: string) => {
      if (seq.current) {
        const [_id, tracks] = seq.current.deleteTrack(id);
        dispatch({ type: 'DELETE_TRACK', value: id });
      }
    },
    [dispatch]
  );

  const reorderTracks = useCallback((tracks: Track[]) => {
    dispatch({ type: 'UPDATE_TRACKS', value: tracks });
  }, []);

  const save = useCallback(async () => {
    if (seq.current) {
      const { state: seqState } = seq.current;
      const { tracks } = seqState;
      const cleanTracks = tracks.map((track) => {
        const { pattern, updateSelfInParent, ...rest } = track;
        return rest;
      });

      // TODO: Reimplement Save here...
    }
  }, [state.tick]);

  useEffect(() => {
    seq.current?.setBpm(state.bpm);
  }, [state.bpm]);

  const value = {
    state,
    dispatch,
    initialize,
    sequencer: seq.current,
    methods: {
      deleteTrack,
      reorderTracks,
      play,
      stop,
      clear,
      changeBpm,
      incrementBpm,
      decrementBpm,
      createTrack,
      repitchTick,
      toggleTick,
      setTrackVal,
      save,
    },
  };

  const start = useCallback(async () => {
    await Tone.start();
    document.querySelector('button')?.removeEventListener('click', start);
  }, []);

  useEffect(() => {
    return () => {
      document.querySelector('button')?.removeEventListener('click', start);
    };
  }, [start]);

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);

  if (context === undefined) {
    throw new Error(
      `useAudioContext must be used within an AudioContextProvider`
    );
  }

  return context;
}
