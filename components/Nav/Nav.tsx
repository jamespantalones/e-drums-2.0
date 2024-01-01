import * as React from 'react';
import {
  Save as SaveIcon,
  Plus as NewIcon,
  Play as PlayIcon,
  Square as StopIcon,
} from 'lucide-react';
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
            onClick={(ev) => {
              if (
                window.confirm(
                  'Are you sure you want to go back to index page?'
                )
              ) {
                methods.stop();
              } else {
                ev.preventDefault();
              }
            }}
          >
            <h1>
              <span className="transition-translate inline-block text-lg">
                E
              </span>
            </h1>
          </Link>

          {children}

          <IconButton small onClick={methods.play} disabled={state.playing}>
            <PlayIcon strokeWidth={1} />
          </IconButton>
          <IconButton
            small
            onClick={methods.stop}
            disabled={!state.initialized}
          >
            <StopIcon strokeWidth={1} />
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
            <NewIcon strokeWidth={1} />
          </IconButton>

          <IconButton onClick={save} small>
            <SaveIcon strokeWidth={1} />
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
