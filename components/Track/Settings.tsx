import Delete from '@mui/icons-material/DeleteOutline';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import Expand from '@mui/icons-material/MoreVert';
import clsx from 'clsx';
import styles from './settings.module.css';
import { useCallback, useState } from 'react';
import { Track } from '../../lib/Track';
import { useAudioContext } from '../../contexts/AudioContext';
import { TrackInput } from '../Track/TrackInput';

export type Props = {
  track: Track;
  pitchEditOn: boolean;
  togglePitch: () => void;
};

export function Settings(props: Props) {
  const { track, togglePitch } = props;

  const {
    methods: { deleteTrack, setTrackVal },
  } = useAudioContext();

  const [open, setOpen] = useState(false);
  const [openInner, setOpenInner] = useState(false);

  function toggleOpen() {
    setOpen((o) => !o);
  }

  const handleDelete = useCallback(() => {
    deleteTrack(track.id);
  }, [deleteTrack, track]);

  /**
   * Change volume for a specific track
   */
  const handleVolChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTrackVal(track, {
        method: 'changeVolume',
        value: parseFloat(ev.target.value),
      });
    },
    [setTrackVal, track]
  );

  /**
   * Change pitch for a specific track
   */
  const handlePitchChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setTrackVal(track, {
        method: 'changePitch',
        value: parseFloat(ev.target.value),
      });
    },
    [setTrackVal, track]
  );

  /**
   * Change instrument for a specific track
   */
  const changeInstrument = useCallback(() => {
    setTrackVal(track, { method: 'changeInstrument', value: undefined });
  }, [setTrackVal, track]);

  return (
    <section
      className={clsx(styles.settings, {
        [styles.open]: open,
      })}
    >
      {/* <div className={styles.vert_group}>
        <button
          className={clsx(styles.toggle)}
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
      <button onClick={toggleOpen} className={clsx(styles.toggle)}>
        <div>
          <MoreVert />
        </div>
      </button> */}

      <div
        className="flex overflow-hidden items-center justify-around transition-all"
        style={{ width: open && openInner ? '200px' : open ? '150px' : '0' }}
      >
        <div className="ml-2">
          <button
            className={clsx('border-b', 'border-neutral-700', 'leading-3')}
            onClick={changeInstrument}
            title="Instrument"
          >
            <span
              style={{
                fontSize: '8px',
                lineHeight: 1,
                width: '20px',
                display: 'block',
                textAlign: 'center',
              }}
            >
              {track.instrument?.sound.name}
            </span>
          </button>
          <button
            className={clsx(styles.toggle, 'leading-3', 'uppercase')}
            onClick={togglePitch}
            title="Toggle Pitch"
            style={{ fontSize: '8px' }}
          >
            Pitch Toggle
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
            value={track.pitch}
            step={1}
            min={0}
            max={100}
            onChange={handlePitchChange}
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
