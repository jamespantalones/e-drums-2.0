import * as React from 'react';
import { Sequencer } from '../lib/Sequencer';
import { audioContextReducer } from './AudioContext.reducer';
import { AudioContextReturnType } from './AudioContext.types';

const AudioContext = React.createContext<AudioContextReturnType | undefined>(
  undefined
);

export function AudioContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const ctx = React.useMemo(() => {
    return new Sequencer({
      initialTracks: [],
    });
  }, []);

  // audio state
  const [state, dispatch] = React.useReducer(audioContextReducer, {
    bpm: 100,
    initialized: false,
    playing: false,
    tick: 0,
    tracks: [],
  });

  const initialize = React.useCallback(async () => {
    try {
      await ctx.init();
      dispatch({ type: '_INITIALIZE' });
      console.log('DONE');
    } catch (err) {
      console.log('ERR', err);
    }
  }, []);

  // methods
  const play = React.useCallback(async () => {
    if (!ctx.isInit) {
      await ctx.init();
    }
    ctx.start();
    dispatch({ type: '_PLAY' });
  }, []);

  const stop = React.useCallback(async () => {
    ctx.stop();
    dispatch({ type: '_STOP' });
  }, []);

  const changeBpm = React.useCallback((bpm: number) => {
    ctx.setBpm(bpm);
    dispatch({ type: 'SET_BPM', value: bpm });
  }, []);

  const value = {
    state,
    dispatch,
    initialize,
    methods: {
      play,
      stop,
      changeBpm,
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
