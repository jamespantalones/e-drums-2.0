import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import config from '../../config/config';
import clsx from 'clsx';
import { TrackInput } from './TrackInput';
import { Library } from '../../types';
import { useCallback, useMemo } from 'react';

export function TrackItem({ index, rhythm }: { index: number; rhythm: Track }) {
  const length = rhythm.pattern.length;

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
          rhythm.totalNotes + 1 > 20
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

  const handleVolumeChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setRhythmVolume({
        track: rhythm,
        volume: parseFloat(ev.target.value),
      });
    },
    [rhythm, setRhythmVolume]
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

  const slices = useMemo(() => new Array(length).fill(0), [length]);

  return (
    <section
      className={styles.section}
      data-color={rhythm.color}
      style={{ '--color-track': rhythm.color } as React.CSSProperties}
    >
      <div className={styles['slice-wrapper']}>
        <button
          className={clsx(styles.slice, styles['note-change'])}
          onClick={handleTotalNoteChangeDecrement}
        >{`<`}</button>

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

        <button
          className={clsx(styles.slice, styles['note-change'])}
          onClick={handleTotalNoteChangeIncrement}
        >{`>`}</button>
      </div>

      <button onClick={handleDelete}>DEL</button>

      {/* <div className="w-full px-2 mt-4">
        <TrackInput
          label={`VOLUME / ${Math.floor(rhythm.volume * 100)}`}
          min={0}
          max={1}
          step={0.01}
          value={rhythm.volume}
          onChange={handleVolumeChange}
        />

        <TrackInput
          label={`MIDI NOTE / ${rhythm.pitch}`}
          min={10}
          max={60}
          step={1}
          value={rhythm.pitch}
          onChange={handlePitchChange}
        />
      </div> */}
    </section>
  );
}
