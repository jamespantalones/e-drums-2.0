import * as React from 'react';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '../IconButton/IconButton';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import config from '../../config/config';
export function Nav() {
  const { state, methods } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <section className={styles.section}>
        <div className="flex items-center">
          <h1 className="select-none mr-2 border-2 border-black h-12 px-4 flex items-center justify-center">
            E-Rhythms
          </h1>
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
          <IconButton onClick={methods.save}>
            <SaveIcon />
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
