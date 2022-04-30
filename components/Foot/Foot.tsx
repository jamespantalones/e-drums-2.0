import * as React from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { TempoSlider } from '../TempoSlider/TempoSlider';

export function Foot() {
  const { state, methods } = useAudioContext();

  return (
    <footer className="px-2 py-0 bg-neutral-100 relative border-t-2 border-black right-0">
      <TempoSlider bpm={state.bpm} onChange={methods.changeBpm} />
    </footer>
  );
}
