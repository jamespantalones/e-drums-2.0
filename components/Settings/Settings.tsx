import Delete from '@mui/icons-material/DeleteOutline';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Expand from '@mui/icons-material/MoreVert';
import clsx from 'clsx';
import styles from './settings.module.css';
import { useMemo, useState } from 'react';
import { Track } from '../../lib/Track';
import { Library, SoundFile } from '../../types';
import { config } from '../../config';

export type Props = {
  open: boolean;
  track: Track;
  changeInstrument: ({
    track,
    instrument,
  }: {
    track: Track;
    instrument: SoundFile;
  }) => void;
  toggleOpen: () => void;
  togglePitch: () => void;
  handleDelete: () => void;
  handleTotalNoteChangeDecrement: (
    ev: React.MouseEvent<HTMLButtonElement>
  ) => void;
  handleTotalNoteChangeIncrement: (
    ev: React.MouseEvent<HTMLButtonElement>
  ) => void;
};

const soundFiles: SoundFile[] = Object.keys(config.SOUNDS).reduce(
  (acc, curr) => {
    return acc.concat(config.SOUNDS[curr as Library]);
  },
  [] as SoundFile[]
);

export function Settings(props: Props) {
  // TODO: This needs to start on correct random index
  const [index, setIndex] = useState(0);

  const {
    open,
    track,
    handleDelete,
    toggleOpen,
    togglePitch,
    handleTotalNoteChangeIncrement,
    handleTotalNoteChangeDecrement,
    changeInstrument,
  } = props;

  function nextSelection() {
    setIndex((l) => {
      const next = l + 1 > soundFiles.length ? 0 : l + 1;
      changeInstrument({ instrument: soundFiles[next], track });
      return next;
    });
  }

  return (
    <section
      className={clsx(styles.settings, {
        [styles.open]: open,
      })}
    >
      <div className={clsx(styles.toggle)}>
        <button onClick={nextSelection}>{index}</button>
      </div>

      <div className={clsx(styles.toggle)}>
        <button onClick={props.toggleOpen}>
          <Expand />
        </button>
      </div>

      {/* <div className={styles.inner}>
        <div className={clsx(styles.exit)}>
          <button onClick={toggleOpen}>
            <Expand />
          </button>
        </div>
        <div className={styles.group}>
          <button onClick={handleTotalNoteChangeDecrement} title="Remove Slice">
            <Remove />
          </button>
          <button onClick={handleTotalNoteChangeIncrement} title="Add Slice">
            <Add />
          </button>
        </div>
        <div className={styles.group}>
          <button onClick={handleDelete}>
            <Delete />
          </button>
        </div>
        <div className={styles.group}>
          <button onClick={togglePitch}>REPITCH</button>
        </div>
      </div> */}
    </section>
  );
}
