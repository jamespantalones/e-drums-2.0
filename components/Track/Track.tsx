import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import config from '../../config/config';
import clsx from 'clsx';
import { TrackInput } from './TrackInput';
import { Library } from '../../types';
import { useCallback, useMemo, useState } from 'react';
import { Settings } from '../Settings/Settings';

export function TrackItem({ index, rhythm }: { index: number; rhythm: Track }) {
  const { length } = useMemo(() => {
    return rhythm.pattern;
  }, [rhythm]);

  const [expanded, setExpanded] = useState(false);

  const {
    state: { tick },
    methods: {
      toggleTick,
      repitchTick,
      deleteTrack,
      setRhythmTicks,
      setRhythmPitch,
      setRhythmVolume,
      changeInstrument,
      changeLibrary,
    },
  } = useAudioContext();

  const handleClick = useCallback(
    (index: number) => {
      return function handler() {
        toggleTick(rhythm.id, index);
      };
    },
    [rhythm, toggleTick]
  );

  const handleDelete = useCallback(() => {
    deleteTrack(rhythm.id);
  }, [rhythm, deleteTrack]);

  const handleTotalNoteChangeIncrement = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      setRhythmTicks({
        track: rhythm,
        ticks:
          rhythm.totalNotes + 1 > config.MAX_SLICES
            ? rhythm.totalNotes
            : rhythm.totalNotes + 1,
      });
    },
    [rhythm, setRhythmTicks]
  );

  const handleTotalNoteChangeDecrement = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      setRhythmTicks({
        track: rhythm,
        ticks:
          rhythm.totalNotes - 1 < 2 ? rhythm.totalNotes : rhythm.totalNotes - 1,
      });
    },
    [rhythm, setRhythmTicks]
  );

  const handlePitchChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setRhythmPitch({
        track: rhythm,
        pitch: parseInt(ev.target.value, 10),
      });
    },
    [rhythm, setRhythmPitch]
  );

  const handleLibraryChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const value = ev.target.value as Library;

      changeLibrary({
        track: rhythm,
        library: value,
      });
    },
    [changeLibrary]
  );

  const decrementPitch = useCallback(
    (index: number) => {
      return function handler() {
        repitchTick(rhythm.id, index, 'DECREMENT');
      };
    },
    [rhythm, repitchTick]
  );

  const incrementPitch = useCallback(
    (index: number) => {
      return function handler() {
        repitchTick(rhythm.id, index, 'INCREMENT');
      };
    },
    [rhythm, repitchTick]
  );

  const handleTrackChange = useCallback(
    async (ev: React.ChangeEvent<HTMLSelectElement>) => {
      // get the value
      const target = config.SOUNDS[rhythm.library].find(
        (e: any) => e.name === ev.target.value
      );

      if (!target) return;

      await changeInstrument({
        track: rhythm,
        instrument: target,
      });
    },
    [rhythm, changeInstrument]
  );

  const toggleOpen = useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  const slices = useMemo(() => new Array(length).fill(0), [length]);

  return (
    <section
      className={clsx(styles.section, {
        [styles.shift]: expanded,
      })}
      data-color={rhythm.color}
      style={{ '--color-track': rhythm.color } as React.CSSProperties}
    >
      <Settings
        open={expanded}
        toggleOpen={toggleOpen}
        handleDelete={handleDelete}
        handleTotalNoteChangeDecrement={handleTotalNoteChangeDecrement}
        handleTotalNoteChangeIncrement={handleTotalNoteChangeIncrement}
      />

      <div
        className={clsx(styles['slice-wrapper'], styles.group, {
          [styles.shift]: expanded,
        })}
      >
        {slices.map((slice, index) => (
          <div key={`${slice.id}-${index}`} className={styles['slice-outer']}>
            <button
              key={index}
              className={clsx(styles.slice, {
                [styles.active]: tick % length === index,
                [styles.enabled]: rhythm.pattern[index],
              })}
              type="button"
              onClick={handleClick(index)}
            />
            <div className={styles.group}>
              <button onClick={decrementPitch(index)}>-</button>
              <button onClick={incrementPitch(index)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
