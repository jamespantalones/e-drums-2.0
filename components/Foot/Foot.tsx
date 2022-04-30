import * as React from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { TempoSlider } from '../TempoSlider/TempoSlider';

export function Foot() {
  const { state, methods } = useAudioContext();

  return (
    <footer className="py-4 px-2 bg-neutral-200 relative border-t-2 border-black">
      <TempoSlider bpm={state.bpm} onChange={methods.changeBpm} />
    </footer>
  );
}
