import * as React from 'react';
import PlayIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import NewIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { IconButton } from '../IconButton/IconButton';
import styles from './Nav.module.css';
import { useAudioContext } from '../../contexts/AudioContext';
import config from '../../config/config';
import { Close, ExitToApp, LiveHelp, QuestionMark } from '@mui/icons-material';
export function Nav({
  aboutOpen,
  toggleAbout,
}: {
  aboutOpen: boolean;
  toggleAbout: () => void;
}) {
  const { state, methods } = useAudioContext();

  return (
    <nav className={styles.nav}>
      <section className={styles.section}>
        <div className="flex items-center">
          <h1 className="select-none mr-2 border-2 uppercase border-black h-8 px-4 flex items-center justify-center">
            E-Drums
          </h1>
          <IconButton onClick={methods.play} disabled={!state.initialized}>
            <PlayIcon />
          </IconButton>
          <IconButton onClick={methods.stop} disabled={!state.initialized}>
            <StopIcon />
          </IconButton>
        </div>

        <div>
          <IconButton
            onClick={methods.createTrack}
            disabled={
              state.tracks.length === config.MAX_TRACKS || !state.initialized
            }
          >
            <NewIcon />
          </IconButton>
          <IconButton onClick={methods.save} disabled={!state.initialized}>
            <SaveIcon />
          </IconButton>

          <IconButton onClick={toggleAbout}>
            {!aboutOpen && <QuestionMark />}
            {aboutOpen && <Close />}
          </IconButton>
        </div>
      </section>
    </nav>
  );
}
