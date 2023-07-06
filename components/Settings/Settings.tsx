import Delete from '@mui/icons-material/DeleteOutline';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Expand from '@mui/icons-material/MoreVert';
import clsx from 'clsx';
import styles from './settings.module.css';
import { useCallback, useState } from 'react';
import { Track } from '../../lib/Track';
import { Library, SoundFile } from '../../types';
import { config } from '../../config';
import { noop, padNumber } from '../../utils';
import { useAudioContext } from '../../contexts/AudioContext';
import { TrackInput } from '../Track/TrackInput';

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
    togglePitch,
    handleTotalNoteChangeIncrement,
    handleTotalNoteChangeDecrement,
  } = props;

  const {
    methods: { deleteTrack, setRhythmTicks, changeInstrument, setRhythmVolume },
  } = useAudioContext();

  const [open, setOpen] = useState(true);
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

  const handleDelete = useCallback(() => {
    deleteTrack(track.id);
  }, [deleteTrack, track]);

  const handleVolChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setRhythmVolume({ track, volume: parseFloat(ev.target.value) });
    },
    []
  );

  return (
    <section
      className={clsx(styles.settings, {
        [styles.open]: open,
      })}
    >
      <button onClick={toggleOpen} className={clsx(styles.toggle)}>
        <div className="rotate-90">⮂</div>
      </button>

      <div
        className="flex overflow-hidden items-center justify-around transition-all"
        style={{ width: open && openInner ? '200px' : open ? '150px' : '0' }}
      >
        <div className={styles.vert_group}>
          <button
            className={clsx(styles.toggle, 'border-b', 'border-neutral-700')}
            onClick={nextSelection}
            title="Instrument"
          >
            <span className="text-xs">{padNumber(index)}</span>
          </button>
          <button
            className={clsx(styles.toggle)}
            onClick={togglePitch}
            title="Toggle Pitch"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 30"
              x="0px"
              y="0px"
            >
              <path
                fill="gray"
                d="M22.75,13a.75.75,0,0,1-.75.75H19a.75.75,0,0,1-.7114-.5127L18.103,12.68l-1.3755,5.5015a.75.75,0,0,1-.6987.5674L16,18.75a.7494.7494,0,0,1-.7114-.5127L12,8.3711,8.7114,18.2368a.7294.7294,0,0,1-.74.5123.75.75,0,0,1-.6987-.5674L5.897,12.68l-.1856.5566A.75.75,0,0,1,5,13.75H2a.75.75,0,0,1,0-1.5H4.46l.8291-2.4873a.75.75,0,0,1,1.4389.0552L8.103,15.3189l3.1856-9.5567a.75.75,0,0,1,1.4228,0l3.1856,9.5567,1.3755-5.5015a.75.75,0,0,1,.6987-.5674.7393.7393,0,0,1,.74.5122l.8291,2.4873H22A.75.75,0,0,1,22.75,13Z"
              />
            </svg>
          </button>
        </div>

        <div className={styles.vert_group}>
          <button
            className={clsx(styles.toggle, 'border-b', 'border-neutral-700')}
            onClick={handleTotalNoteChangeIncrement}
            title="Add Slice"
          >
            <Add />
          </button>
          <button
            className={clsx(styles.toggle)}
            onClick={handleTotalNoteChangeDecrement}
            title="Remove Slice"
          >
            <Remove />
          </button>
        </div>

        <div className="mx-1">
          <TrackInput
            label="Volume"
            onChange={handleVolChange}
            min={0}
            max={1}
            step={0.01}
            value={track.volume}
          />

          <TrackInput
            label="Pitch"
            value={track.volume}
            step={1}
            min={0}
            max={100}
            onChange={(ev) => setPitch(parseInt(ev.target.value))}
          />
        </div>

        <button
          onClick={() => {
            setOpenInner((o) => !o);
          }}
          className={clsx(styles.toggle)}
        >
          <Expand />
        </button>

        <div
          className="flex items-center justify-center overflow-hidden transition-all"
          style={{ width: openInner ? '50px' : '0' }}
        >
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
