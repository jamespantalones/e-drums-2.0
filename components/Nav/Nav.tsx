import * as React from 'react';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import { IconButton } from '../IconButton/IconButton';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import { Highlight } from '../Highlight/Highlight';
import config from '../../config/config';
export function Nav() {
  const { state, methods } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <Highlight>
        <h1 className="text-xs uppercase">E-Rhythms 0.0.2</h1>
      </Highlight>
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
          <IconButton
            onClick={methods.createTrack}
            disabled={state.tracks.length === config.MAX_TRACKS}
          >
            <NewIcon />
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
