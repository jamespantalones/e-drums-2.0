import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import { scaleLinear } from 'd3-scale';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { Slice } from './Slice';
import { Config, SOUNDS } from '../../config';
import { IconButton } from '../IconButton/IconButton';
import { Knob } from '../inputs/Knob';

export function TrackItem({ rhythm, index }: { index: number; rhythm: Track }) {
  const {
    methods: { setTrackVal, deleteTrack },
  } = useAudioContext();

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);

  const addNote = useCallback(() => {
    setTrackVal(rhythm, { method: 'addNote' });
  }, [rhythm, setTrackVal]);

  const removeNote = useCallback(
    (index: number) => {
      setTrackVal(rhythm, { method: 'removeNote', value: index });
    },
    [rhythm, setTrackVal]
  );

  const removeNoteOnClick = useCallback(
    (index: number) => {
      return function handler() {
        removeNote(index);
      };
    },
    [removeNote]
  );

  const toggleMute = useCallback(() => {
    rhythm.toggleMute();
  }, [rhythm]);

  const style: React.CSSProperties = {
    '--color-track': rhythm.color,
  } as React.CSSProperties;

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

  useEffect(() => {
    if (rhythm.pattern.length === 0) {
      deleteTrack(rhythm.id);
    }
  }, [rhythm.pattern.length, rhythm.id, deleteTrack]);

  return (
    <section
      className={clsx(styles.section, {})}
      data-color={rhythm.color}
      style={style}
    >
      <div className={clsx(styles['track-wrapper'], styles.group)}>
        {/* MUTE BUTTON */}
        <div className={styles.edit}>
          <div className={styles['top-edit-row']}>
            <button
              onClick={toggleMute}
              className={clsx({
                [styles['toggle-mute']]: true,
                [styles.muted]: rhythm.muted,
              })}
            ></button>

            <select
              value={rhythm.instrument?.sound.name}
              className={styles['edit-name']}
              onChange={handleInstrumentChange}
            >
              {SOUNDS.map((sound) => (
                <option key={sound.name} value={sound.name}>
                  {sound.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex">
            <Knob
              label="pitch"
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
            />
          </div>
          <div>
            <button
              className={styles['delete-button']}
              title="Delete Track"
              onClick={() => deleteTrack(rhythm.id)}
            >
              Del
            </button>
          </div>
        </div>

        {rhythm.pattern.map((slice, index) => (
          <div key={`${rhythm.id}-${slice}-${index}`}>
            <Slice
              key={`${rhythm.id}-${slice}-${index}`}
              index={index}
              rhythm={rhythm}
              length={length}
            />
            <button
              onClick={removeNoteOnClick(index)}
              className={styles['delete-slice-button']}
            >
              -
            </button>
          </div>
        ))}

        {rhythm.totalNotes < Config.MAX_SLICES && (
          <div>
            <IconButton onClick={addNote} color="black">
              <div className={styles['add-button']}>
                <span className="-translate-y-0.5">+</span>
              </div>
            </IconButton>
          </div>
        )}
      </div>
    </section>
  );
}
