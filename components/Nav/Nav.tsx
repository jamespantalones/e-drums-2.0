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
export function Nav({ save }: { save: () => Promise<void> }) {
  const { state, methods } = useAudioContext();
  const tempoButton = React.useRef<null | HTMLButtonElement>(null);
  const dy = React.useRef<number>(0);

  const slide = React.useCallback(
    (ev: PointerEvent) => {
      if (ev.clientY < dy.current) {
        methods.decrementBpm();
      } else {
        methods.incrementBpm();
      }

      dy.current = ev.clientY;
    },
    [methods]
  );

  const onPointerDown = React.useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>) => {
      if (tempoButton.current) {
        dy.current = ev.clientY;
        tempoButton.current.onpointermove = throttle(slide, 20);
        tempoButton.current.setPointerCapture(ev.pointerId);
      }
    },
    [slide]
  );

  const onPointerUp = React.useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>) => {
      if (tempoButton.current) {
        tempoButton.current.onpointermove = null;
        tempoButton.current.releasePointerCapture(ev.pointerId);
        dy.current = ev.clientY;
      }
    },
    []
  );

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

          <button
            className="ml-4 block border border-current px-2 rounded-sm w-12 py-1"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            ref={tempoButton}
          >
            <p style={{ fontSize: '10px' }}>{state.bpm}</p>
          </button>
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
