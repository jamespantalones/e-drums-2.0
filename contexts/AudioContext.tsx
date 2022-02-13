import * as React from 'react';
import { Sequencer } from '../lib/Sequencer';
import { Track } from '../lib/Track';
import { AudioContextReturnType, SoundFile } from '../types';
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

  // create the Sequencer
  const sequencer = React.useMemo(() => {
    // async here?
    return new Sequencer({
      initialTracks: [Sequencer.generateTrack(0), Sequencer.generateTrack(1)],
      onTick: incrementTick,
      bpm: state.bpm,
    });
  }, []);

  // make sure the AudioContext is initialized
  const initialize = React.useCallback(async () => {
    try {
      const s = await sequencer.init();
      dispatch({ type: 'INITIALIZE', value: s.state.tracks });
    } catch (err) {
      console.log(err);
    }
  }, [sequencer]);

  // methods
  const play = React.useCallback(async () => {
    if (!sequencer.isInit) {
      await sequencer.init();
    }
    sequencer.start();
    dispatch({ type: '_PLAY' });
  }, [sequencer]);

  const stop = React.useCallback(async () => {
    sequencer.stop();
    dispatch({ type: '_STOP' });
  }, [sequencer]);

  const changeBpm = React.useCallback(
    (bpm: number) => {
      sequencer.setBpm(bpm);
      dispatch({ type: 'SET_BPM', value: bpm });
    },
    [sequencer]
  );

  const createTrack = React.useCallback(async () => {
    // add to Sequencer
    const track = await sequencer.addNewRhythm(
      Sequencer.generateTrack(state.tracks.length)
    );

    // add to state
    dispatch({ type: 'ADD_TRACK', value: track });
  }, [sequencer, state.tracks]);

  const toggleTick = React.useCallback(
    (id: string, index: number) => {
      // update in sequencer
      const [_track, tracks] = sequencer.toggleTick(id, index);

      // update in state
      dispatch({ type: 'UPDATE_TRACKS', value: tracks });
    },
    [sequencer]
  );

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
      const [_id, tracks] = sequencer.deleteTrack(id);
      dispatch({ type: 'DELETE_TRACK', value: id });
    },
    [sequencer, dispatch]
  );

  const value = {
    state,
    dispatch,
    initialize,
    methods: {
      deleteTrack,
      play,
      stop,
      changeBpm,
      createTrack,
      toggleTick,
      setRhythmTicks,
      setRhythmPitch,
      setRhythmVolume,
      changeInstrument,
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
