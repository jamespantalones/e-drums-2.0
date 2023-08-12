import * as React from 'react';
import Link from 'next/link';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { IconButton } from '../IconButton/IconButton';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import { Config } from '../../config';
export function Nav({ save }: { save: () => Promise<void> }) {
  const { state, methods } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <section className={styles.section}>
        <div className="flex items-center justify-between ml-1.5">
          <IconButton
            margin
            onClick={methods.play}
            disabled={!state.initialized}
          >
            <PlayIcon />
          </IconButton>
          <IconButton
            margin
            onClick={methods.stop}
            disabled={!state.initialized}
          >
            <StopIcon />
          </IconButton>
          <IconButton
            margin
            onClick={methods.clear}
            disabled={!state.initialized}
          >
            <ClearAllIcon />
          </IconButton>
        </div>

        <div className="flex">
          <IconButton
            onClick={methods.createTrack}
            noBorder
            margin
            disabled={
              state.tracks.length === Config.MAX_TRACKS || !state.initialized
            }
          >
            <NewIcon />
          </IconButton>

          <IconButton onClick={save} noBorder margin>
            <SaveIcon />
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
