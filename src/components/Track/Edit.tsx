import { DragControls } from 'framer-motion';
import { Knob } from '../inputs/Knob';
import styles from './Edit.module.css';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import { Config, SOUNDS } from '../../config';
import clsx from 'clsx';
import { ReorderIcon } from './ReorderIcon';
import { generateRandomColor } from '../../lib/utils';
import { padNumber } from '../../utils';
import { Minus, Plus } from 'lucide-react';
import { Slider } from '../inputs/Slider';

export function Edit({
  dragControls,
  editPitch,
  rhythm,
  removeNote,
  setEditPitch,
}: {
  dragControls: DragControls;
  editPitch: boolean;
  rhythm: Track;
  removeNote: (index: number) => void;
  setEditPitch: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    methods: { setTrackVal, deleteTrack },
  } = useAudioContext();

  const [muted, setMuted] = useState(rhythm.muted);

  const addNote = useCallback(() => {
    setTrackVal(rhythm, { method: 'addNote' });
  }, [rhythm, setTrackVal]);

  const toggleEditPitch = useCallback(() => {
    setEditPitch((p) => !p);
  }, [setEditPitch]);

  const toggleMute = useCallback(() => {
    rhythm.toggleMute();
    setMuted((m) => !m);
  }, [rhythm]);

  const handleInstrumentChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const target = SOUNDS.find((s) => s.name === ev.target.value);
      if (target) {
        setTrackVal(rhythm, {
          method: 'changeInstrument',
          value: target,
        });
      }
    },
    [setTrackVal, rhythm]
  );

  const handlePitchChange = useCallback(
    (val: number) => {
      if (val) {
        setTrackVal(rhythm, {
          method: 'changePitch',
          value: val,
        });
      }
    },
    [setTrackVal, rhythm]
  );

  const handleVolumeChange = useCallback(
    (val: number) => {
      if (val) {
        // scale the value
        setTrackVal(rhythm, {
          method: 'changeVolume',
          value: val,
        });
      }
    },
    [setTrackVal, rhythm]
  );

  const toggleColor = useCallback(
    (_ev: React.MouseEvent<HTMLButtonElement>) => {
      setTrackVal(rhythm, {
        method: 'changeColor',
        value: generateRandomColor(),
      });
    },
    [setTrackVal, rhythm]
  );

  return (
    <>
      <div>
        {/* left panel */}
        <div className="flex">
          <section className="w-24">
            <div className="flex">
              <ReorderIcon dragControls={dragControls} />
              <section className={styles.total}>
                {padNumber(rhythm.totalNotes)}
              </section>
            </div>
            <select
              value={rhythm.instrument?.sound.name}
              className={styles['instrument-select']}
              onChange={handleInstrumentChange}
            >
              {SOUNDS.map((sound) => (
                <option key={sound.name} value={sound.name}>
                  {sound.name}
                </option>
              ))}
            </select>

            {/* mute/solo */}
            <div className={styles['poly-button-group']}>
              <button
                onClick={toggleColor}
                style={{ backgroundColor: `hsl(${rhythm.color.join(' ')})` }}
                className={clsx({
                  [styles['toggle-color']]: true,
                })}
              ></button>
              <button
                onClick={toggleMute}
                className={clsx(styles.toggle, {
                  [styles['toggle-mute']]: true,
                  [styles.muted]: muted,
                })}
              >
                MUTE
              </button>
              <button
                onClick={toggleEditPitch}
                className={clsx(styles.toggle, {
                  [styles.active]: editPitch,
                  [styles['toggle-pitch']]: true,
                })}
              >
                PITCH
              </button>
            </div>
          </section>

          <section className={styles['length-panel']}>
            <button
              onClick={addNote}
              className={styles['add-button']}
              disabled={rhythm.totalNotes >= Config.MAX_SLICES}
            >
              <Plus size={16} />
            </button>
            <button
              onClick={() => {
                if (rhythm.pattern.length - 1 === 0) {
                  deleteTrack(rhythm.id);
                  return;
                }
                removeNote(rhythm.pattern.length - 1);
              }}
              className={styles['subtract-button']}
            >
              <Minus size={16} />
            </button>
          </section>
        </div>
        <section className="block">
          <div className={styles['knob-group']}>
            <Slider
              min={30}
              max={70}
              value={rhythm.pitch}
              onChange={handlePitchChange}
            />
            <Slider
              value={rhythm.prevVolume}
              onChange={handleVolumeChange}
              min={0}
              max={100}
              step={1}
            />
            {/* <Knob
            label="tone"
            step={1}
            onChange={handlePitchChange}
            value={rhythm.pitch}
            min={30}
            max={70}
          />
          <Knob
            onChange={handleVolumeChange}
            value={rhythm.prevVolume}
            label="vol"
            min={0}
            max={100}
            step={1}
          /> */}
          </div>
        </section>
      </div>
    </>
  );
}
