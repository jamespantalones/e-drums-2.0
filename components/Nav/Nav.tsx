import * as React from 'react';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '../IconButton/IconButton';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import { Config } from '../../config';
import { TempoInput } from './TempoInput';
import Link from 'next/link';
import clsx from 'clsx';

export function Nav({
  save,
  children,
}: {
  save: () => Promise<void>;
  children: React.ReactNode;
}) {
  const {
    state,
    methods,
    methods: { changeBpm },
  } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <section className={styles.section}>
        <div className="flex items-center justify-between ml-1.5 ">
          <Link
            href="/"
            className={clsx(styles.link, 'block text-sm mr-6')}
            passHref
            onClick={() => {
              methods.stop();
              // sequencer?.stop_all();
              // sequencer?.clear();
            }}
          >
            <h1>
              <span className="transition-translate inline-block">/\</span>
            </h1>
          </Link>

          {children}

          <IconButton small onClick={methods.play} disabled={state.playing}>
            <PlayIcon />
          </IconButton>
          <IconButton
            small
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
            small
            disabled={
              state.tracks.length === Config.MAX_TRACKS || !state.initialized
            }
          >
            <NewIcon />
          </IconButton>

          <IconButton onClick={save} small>
            <SaveIcon />
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
