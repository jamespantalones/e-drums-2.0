import DeleteIcon from '@mui/icons-material/Close';
import * as React from 'react';
import { neutral, blue } from 'tailwindcss/colors';
import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import { IconButton } from '../IconButton/IconButton';
import styles from './Track.module.css';
import config from '../../config/config';
import clsx from 'clsx';
import { TrackInput } from './TrackInput';
import { Library } from '../../types';

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

  const datasets = () => {
    const color = new Array(length).fill(0).map((_val, i) => {
      const active = tick % length === i;
      const enabled = rhythm.pattern[i];

      // if slice is enabled, but not currently triggered
      if (active && !enabled) {
        return neutral['500'];
      }

      // if slice is enabled, and triggered
      if (active && enabled) {
        return rhythm.color;
      }

      // enabled
      if (enabled) {
        return neutral['400'];
      }

      // not active or selected
      return neutral['200'];
    });

    return [
      {
        data,
        animation: false,
        offset: 0,
        borderWidth: 1,
        borderColor: 'black',
        hoverBorderWidth: 1,
        backgroundColor: color,
        hoverBackgroundColor: color,
      },
    ];
  };

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

  return (
    <section className={styles.section}>
      <nav style={{ backgroundColor: rhythm.color }} className={styles.nav}>
        <div className="">
          <label className="flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs">MACHINE</p>
              <select
                value={rhythm.library}
                className="text-xs border-2 border-black"
                onChange={handleLibraryChange}
              >
                <option value="MINIPOPS">MINIPOPS</option>
                <option value="TR727">TR727</option>
                <option value="RAVEN">RAVEN</option>
              </select>
            </div>
          </label>
        </div>
        <div className="my-2">
          <label className="flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs">INSTRUMENT</p>
              <select
                value={rhythm.currentInstrument?.parent.name || ''}
                onChange={handleTrackChange}
                className="text-xs border-2 border-black"
              >
                <option value=""> </option>
                {rhythm.soundOptions.map((opt) => (
                  <option key={opt.name} value={opt.name}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
        <div className="z-10">
          <IconButton small onClick={handleDelete} muted>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </nav>
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
          >
            {index}
          </button>
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
