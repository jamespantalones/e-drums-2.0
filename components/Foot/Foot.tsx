import * as React from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { TempoSlider } from '../TempoSlider/TempoSlider';

export function Foot() {
  const { state, methods } = useAudioContext();

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-4 px-2 bg-neutral-200 shadow-xl">
      <TempoSlider bpm={state.bpm} onChange={methods.changeBpm} />
    </footer>
  );
}
