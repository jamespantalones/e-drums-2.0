import DeleteIcon from '@mui/icons-material/Close';
import * as React from 'react';
import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import config from '../../config/config';
import clsx from 'clsx';
import { TrackInput } from './TrackInput';
import { Library } from '../../types';
import Tippy from '@tippyjs/react';

export function TrackItem({ index, rhythm }: { index: number; rhythm: Track }) {
  const length = rhythm.pattern.length;

  const {
    state: { tick },
    methods: {
      toggleTick,
      deleteTrack,
      setRhythmTicks,
      setRhythmPitch,
      setRhythmVolume,
      changeInstrument,
      changeLibrary,
    },
  } = useAudioContext();

  const data = React.useMemo(() => {
    return new Array(length).fill(Math.round(100 / length));
  }, [length]);

  const handleClick = React.useCallback(
    (index: number) => {
      return function handler(ev: React.MouseEvent<HTMLButtonElement>) {
        toggleTick(rhythm.id, index);
      };
    },
    [rhythm, toggleTick]
  );

  const handleDelete = React.useCallback(() => {
    deleteTrack(rhythm.id);
  }, [rhythm, deleteTrack]);

  const handleTotalNoteChangeIncrement = React.useCallback(
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

  const handleTotalNoteChangeDecrement = React.useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      setRhythmTicks({
        track: rhythm,
        ticks:
          rhythm.totalNotes - 1 < 2 ? rhythm.totalNotes : rhythm.totalNotes - 1,
      });
    },
    [rhythm, setRhythmTicks]
  );

  const handlePitchChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setRhythmPitch({
        track: rhythm,
        pitch: parseInt(ev.target.value, 10),
      });
    },
    [rhythm, setRhythmPitch]
  );

  const handleVolumeChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setRhythmVolume({
        track: rhythm,
        volume: parseFloat(ev.target.value),
      });
    },
    [rhythm, setRhythmVolume]
  );

  const handleLibraryChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const value = ev.target.value as Library;

      changeLibrary({
        track: rhythm,
        library: value,
      });
    },
    [changeLibrary]
  );

  const handleTrackChange = React.useCallback(
    async (ev: React.ChangeEvent<HTMLSelectElement>) => {
      // get the value
      const target = config.SOUNDS[rhythm.library].find(
        (e: any) => e.name === ev.target.value
      );
      if (!target) {
        return;
      }

      await changeInstrument({
        track: rhythm,
        instrument: target,
      });
    },
    [rhythm, changeInstrument]
  );

  const slices = React.useMemo(() => {
    return new Array(length).fill(0);
  }, [length]);

  /*
  <div>
          <Tippy>
            <button>+</button>
          </Tippy>
        </div>*/

  console.log('c', rhythm.color);

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
          <button
            key={index}
            className={clsx(styles.slice, {
              [styles.active]: tick % length === index,
              [styles.enabled]: rhythm.pattern[index],
            })}
            type="button"
            onClick={handleClick(index)}
          />
        ))}

        <button
          className={clsx(styles.slice, styles['note-change'])}
          onClick={handleTotalNoteChangeIncrement}
        >{`>`}</button>
      </div>
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
