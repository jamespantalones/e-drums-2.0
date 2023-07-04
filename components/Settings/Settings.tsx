import Delete from '@mui/icons-material/DeleteOutline';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Expand from '@mui/icons-material/MoreVert';
import clsx from 'clsx';
import styles from './settings.module.css';
import { useState } from 'react';
import { Track } from '../../lib/Track';
import { Library, SoundFile } from '../../types';
import { config } from '../../config';
import { noop, padNumber } from '../../utils';

export type Props = {
  track: Track;
  changeInstrument: ({
    track,
    instrument,
  }: {
    track: Track;
    instrument: SoundFile;
  }) => void;
  pitchEditOn: boolean;
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
    track,
    handleDelete,
    togglePitch,
    handleTotalNoteChangeIncrement,
    handleTotalNoteChangeDecrement,
    changeInstrument,
  } = props;

  const [open, setOpen] = useState(false);
  const [openInner, setOpenInner] = useState(false);
  const [pitch, setPitch] = useState(50);

  function nextSelection() {
    setIndex((l) => {
      const next = l + 1 > soundFiles.length ? 0 : l + 1;
      changeInstrument({ instrument: soundFiles[next], track });
      return next;
    });
  }

  function toggleOpen() {
    setOpen((o) => !o);
  }

  return (
    <section
      className={clsx(styles.settings, {
        [styles.open]: open,
      })}
    >
      <button onClick={toggleOpen} className={clsx(styles.toggle)}>
        <Expand />
      </button>

      <div
        className="flex overflow-hidden items-center justify-around transition-all"
        style={{ width: open && openInner ? '200px' : open ? '100px' : '0' }}
      >
        <div className={clsx(styles.toggle)}>
          <button onClick={nextSelection}>{padNumber(index)}</button>
        </div>

        <button
          className={clsx(styles.toggle)}
          onClick={handleTotalNoteChangeDecrement}
          title="Remove Slice"
        >
          <Remove />
        </button>

        <button
          className={clsx(styles.toggle)}
          onClick={handleTotalNoteChangeIncrement}
          title="Add Slice"
        >
          <Add />
        </button>

        <button
          onClick={() => {
            setOpenInner((o) => !o);
            togglePitch();
          }}
          className={clsx(styles.toggle)}
        >
          <Expand />
        </button>

        <div
          className="flex items-center justify-center overflow-hidden transition-all"
          style={{ width: openInner ? '100px' : '0' }}
        >
          <label
            className="uppercase text-center mt-4"
            style={{ fontSize: '8px' }}
          >
            <input
              style={{ width: '50px' }}
              type="range"
              value={pitch}
              step={1}
              min={0}
              max={100}
              onChange={(ev) => setPitch(parseInt(ev.target.value))}
            />
            Pitch
          </label>
          <button
            className={(clsx(styles.toggle), 'w-4', 'h-4', 'overflow-hidden')}
            onClick={handleDelete}
          >
            <Delete />
          </button>
        </div>
      </div>
    </section>
  );
}
