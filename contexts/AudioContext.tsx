import * as React from 'react';
import localforage from 'localforage';
import { Sequencer } from '../lib/Sequencer';
import { Track } from '../lib/Track';
import { AudioContextReturnType, Library, SoundFile } from '../types';
import { audioContextReducer } from './AudioContext.reducer';

const AudioContext = React.createContext<AudioContextReturnType | undefined>(
  undefined
);

export function AudioContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // audio state
  const [state, dispatch] = React.useReducer(audioContextReducer, {
    bpm: 82,
    initialized: false,
    playing: false,
    tick: -1,
    tracks: [],
  });

  const incrementTick = React.useCallback(
    (tickVal: number) => {
      dispatch({ type: 'INCREMENT_TICK', value: tickVal });
    },
    [dispatch]
  );

  let seq = React.useRef<Sequencer>();

  // make sure the AudioContext is initialized
  const initialize = React.useCallback(async () => {
    try {
      // setup localstorage
      localforage.config({
        storeName: 'e-drums',
        name: 'e-drums',
      });

      // get anything out of local
      const initialState = await localforage.getItem<{
        rhythmIndex: number;
        tracks: Track[];
        bpm: number;
      }>('state');

      if (initialState) {
        changeBpm(initialState.bpm);
        seq.current = new Sequencer({
          initialTracks: initialState.tracks,
          onTick: incrementTick,
          bpm: initialState.bpm,
        });
      } else {
        seq.current = new Sequencer({
          initialTracks: [
            Sequencer.generateTrack(0),
            Sequencer.generateTrack(1),
          ],
          onTick: incrementTick,
          bpm: state.bpm,
        });
      }

      const s = await seq.current.init();

      dispatch({ type: 'INITIALIZE', value: s.state.tracks });
    } catch (err) {
      console.log(err);
    }
  }, []);

  // methods
  const play = React.useCallback(async () => {
    if (seq.current && !seq.current.isInit) {
      await seq.current.init();
    }
    seq.current?.start();
    dispatch({ type: '_PLAY' });
  }, []);

  const stop = React.useCallback(async () => {
    seq.current?.stop();
    dispatch({ type: '_STOP' });
  }, []);

  const changeBpm = React.useCallback((bpm: number) => {
    seq.current?.setBpm(bpm);
    dispatch({ type: 'SET_BPM', value: bpm });
  }, []);

  const changeLibrary = React.useCallback(
    ({ track, library }: { track: Track; library: Library }) => {
      // first set in sequencer
      const tu = track.changeLibrary(library);

      // now set in state
      dispatch({ type: 'UPDATE_TRACK', value: tu });

      return tu;
    },
    []
  );

  const createTrack = React.useCallback(async () => {
    // add to Sequencer
    const track = await seq.current?.addNewRhythm(
      Sequencer.generateTrack(state.tracks.length)
    );

    if (track) {
      // add to state
      dispatch({ type: 'ADD_TRACK', value: track });
    }
  }, [state.tracks]);

  const toggleTick = React.useCallback((id: string, index: number) => {
    if (seq.current) {
      const [_track, tracks] = seq.current.toggleTick(id, index);

      // update in state
      dispatch({ type: 'UPDATE_TRACKS', value: tracks });
    }
    // update in sequencer
  }, []);

  const setRhythmTicks = React.useCallback(
    ({ track, ticks }: { track: Track; ticks: number }) => {
      // first set in sequencer
      const tu = track.setRhythmTicks(ticks);

      // now set in state
      dispatch({ type: 'UPDATE_TRACK', value: tu });
    },
    []
  );

  const changeInstrument = React.useCallback(
    async ({ track, instrument }: { track: Track; instrument: SoundFile }) => {
      // first set in sequencer
      const tu = await track.changeInstrument(instrument);

      // now set in state
      dispatch({ type: 'UPDATE_TRACK', value: tu });

      return tu;
    },
    []
  );

  const setRhythmPitch = React.useCallback(
    ({ track, pitch }: { track: Track; pitch: number }) => {
      // first set in sequencer
      const tu = track.changePitch(pitch);

      // now set in state
      dispatch({ type: 'UPDATE_TRACK', value: tu });
    },
    []
  );

  const setRhythmVolume = React.useCallback(
    ({ track, volume }: { track: Track; volume: number }) => {
      // first set in sequencer
      const tu = track.changeVolume(volume);

      // now set in state
      dispatch({ type: 'UPDATE_TRACK', value: tu });
    },
    []
  );

  const deleteTrack = React.useCallback(
    (id: string) => {
      if (seq.current) {
        const [_id, tracks] = seq.current.deleteTrack(id);
        dispatch({ type: 'DELETE_TRACK', value: id });
      }
    },
    [dispatch]
  );

  const save = React.useCallback(async () => {
    if (seq.current) {
      const { state: seqState } = seq.current;
      const { tracks } = seqState;
      const cleanTracks = tracks.map((track) => {
        const { audio, updateSelfInParent, ...rest } = track;
        return rest;
      });

      try {
        const s = await localforage.setItem('state', {
          ...seqState,
          tracks: cleanTracks,
          bpm: state.bpm,
        });
      } catch (err) {
        console.log(err);
      }
    }
  }, [state]);

  const value = {
    state,
    dispatch,
    initialize,
    methods: {
      deleteTrack,
      play,
      stop,
      changeBpm,
      changeLibrary,
      createTrack,
      toggleTick,
      setRhythmTicks,
      setRhythmPitch,
      setRhythmVolume,
      changeInstrument,
      save,
    },
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = React.useContext(AudioContext);
  if (context === undefined) {
    throw new Error(
      `useAudioContext must be used within an AudioContextProvider`
    );
  }

  return context;
}
