import * as React from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { TempoSlider } from '../TempoSlider/TempoSlider';

import styles from './footer.module.css';

export function Foot() {
  const { state, methods } = useAudioContext();

  return (
    <footer className={styles.footer}>
      <TempoSlider bpm={state.bpm} onChange={methods.changeBpm} />
    </footer>
  );
}
