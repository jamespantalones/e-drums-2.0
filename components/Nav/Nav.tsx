import * as React from 'react';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import throttle from 'lodash.throttle';
import { IconButton } from '../IconButton/IconButton';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import { Config } from '../../config';
import { TempoInput } from './TempoInput';

export function Nav({ save }: { save: () => Promise<void> }) {
  const {
    state,
    methods,
    methods: { changeBpm },
  } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <section className={styles.section}>
        <div className="flex items-center justify-between ml-1.5">
          <IconButton margin onClick={methods.play}>
            <PlayIcon />
          </IconButton>
          <IconButton
            margin
            onClick={methods.stop}
            disabled={!state.initialized}
          >
            <StopIcon />
          </IconButton>

          <div className="-translate-y-1">
            <TempoInput onChange={changeBpm} label="BPM" value={state.bpm} />
          </div>
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
