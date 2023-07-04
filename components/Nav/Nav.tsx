import * as React from 'react';
import Link from 'next/link';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '../IconButton/IconButton';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import { config } from '../../config';
export function Nav() {
  const { state, methods } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <section className={styles.section}>
        <div className="flex items-center">
          <Link href="/" passHref>
            <h1 className="mr-8">E-Drums</h1>
          </Link>
          <IconButton onClick={methods.play} disabled={!state.initialized}>
            <PlayIcon />
          </IconButton>
          <IconButton onClick={methods.stop} disabled={!state.initialized}>
            <StopIcon />
          </IconButton>
        </div>

        <div className="flex">
          <IconButton
            onClick={methods.createTrack}
            noBorder
            disabled={
              state.tracks.length === config.MAX_TRACKS || !state.initialized
            }
          >
            <NewIcon />
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
