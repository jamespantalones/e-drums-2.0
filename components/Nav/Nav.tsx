import * as React from 'react';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import { IconButton } from '../IconButton/IconButton';
import { TempoSlider } from '../TempoSlider/TempoSlider';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import { generateId } from '../../utils';
export function Nav() {
  const { state, dispatch, initialize, methods } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <h1 className="text-xs uppercase">E-Rhythms 0.0.2</h1>
      <section className={styles.section}>
        <div>
          <IconButton onClick={methods.play}>
            <PlayIcon />
          </IconButton>
          <IconButton onClick={methods.stop}>
            <StopIcon />
          </IconButton>
        </div>

        <div>
          <IconButton onClick={methods.createTrack}>
            <NewIcon />
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
