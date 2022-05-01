import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Close';
import { ActiveElement, ChartEvent } from 'chart.js';
import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Draggable, { DraggableEvent } from 'react-draggable';
import { neutral, blue } from 'tailwindcss/colors';
import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import { IconButton } from '../IconButton/IconButton';
import styles from './Track.module.css';
import config from '../../config/config';
import clsx from 'clsx';
import { TrackInput } from './TrackInput';
import { Library } from '../../types';

const INDEX_OFFSET = 15;
export function TrackItem({
  index,
  rhythm,
  rect,
}: {
  index: number;
  rhythm: Track;
  rect: Omit<DOMRect, 'toJSON'>;
}) {
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
    (_ev: ChartEvent, elements: ActiveElement[]) => {
      const [item] = elements;
      if (rhythm && item) {
        toggleTick(rhythm.id, item.index);
      }
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

  const handleTotalNoteChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setRhythmTicks({
        track: rhythm,
        ticks: parseInt(ev.target.value, 10),
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

  const handleZIndex = React.useCallback((ev: DraggableEvent) => {
    let elems = document.getElementsByClassName('react-draggable');
    for (let i = 0; i < elems.length; i += 1) {
      // @ts-ignore
      elems[i].style.zIndex = 1;
    }

    const target = ev.currentTarget as HTMLElement;
    target.style.zIndex = '2';
  }, []);

  return (
    <Draggable
      key={rhythm.id}
      handle=".handle"
      onStart={handleZIndex}
      bounds=".gridpaper"
    >
      <section
        key={rhythm.id}
        className={styles.section}
        style={{
          top: `${INDEX_OFFSET * index}px`,
          left: `${INDEX_OFFSET * index}px`,
          zIndex: 3,
        }}
      >
        <div className={styles.wrapper}>
          <nav style={{ backgroundColor: rhythm.color }} className={styles.nav}>
            <div className={clsx('handle', 'cursor-move', 'w-full')}>
              <MenuIcon style={{ fill: 'black' }} />
            </div>
            <div className="z-10">
              <IconButton small onClick={handleDelete} muted>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </nav>
          <div className="w-64 h-64 cursor-pointer">
            <Doughnut
              width={10}
              height={10}
              data={{ labels: [], datasets: datasets() }}
              options={
                {
                  cutout: 5,
                  radius: 100,
                  events: ['click'],
                  onClick: handleClick,
                  borderColor: '#000',
                  borderWidth: 0.5,
                  borderAlign: 'inner',
                  hoverBorderWidth: 2,

                  animation: {
                    animateRotate: false,
                  },

                  plugins: {
                    tooltip: {
                      enabled: false,
                      mode: 'nearest',
                    },
                  },
                  hover: {
                    mode: undefined,
                  },
                } as unknown as any
              }
            />
          </div>
          <div className="w-full px-2">
            <TrackInput
              label={`SLICES / ${rhythm.totalNotes}`}
              min={2}
              max={config.MAX_SLICES}
              step={1}
              value={rhythm.totalNotes}
              onChange={handleTotalNoteChange}
            />

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
              min={0}
              max={127}
              step={1}
              value={rhythm.pitch}
              onChange={handlePitchChange}
            />

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
          </div>
        </div>
      </section>
    </Draggable>
  );
}
