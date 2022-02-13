import MenuIcon from '@mui/icons-material/Menu';
import DeleteIcon from '@mui/icons-material/Close';
import { ActiveElement, ChartEvent } from 'chart.js';
import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import Draggable from 'react-draggable';
import { neutral, yellow, blue } from 'tailwindcss/colors';
import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import { IconButton } from '../IconButton/IconButton';
import styles from './Track.module.css';
import config from '../../config/config';
import { Highlight } from '../Highlight/Highlight';
import clsx from 'clsx';
export function TrackItem({ rhythm }: { rhythm: Track }) {
  const length = rhythm.pattern.length;
  const nodeRef = React.useRef<HTMLDivElement | null>(null);

  const {
    state: { tick },
    methods: {
      toggleTick,
      deleteTrack,
      setRhythmTicks,
      setRhythmPitch,
      changeInstrument,
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

  const datasets = React.useMemo(() => {
    const color = new Array(length).fill(0).map((_val, i) => {
      const active = tick % length === i;
      const enabled = rhythm.pattern[i];

      // if slice is enabled, but not currently triggered
      if (active && !enabled) {
        return neutral['500'];
      }

      // if slice is enabled, and triggered
      if (active && enabled) {
        return yellow['400'];
      }

      // enabled
      if (enabled) {
        return neutral['400'];
      }

      // not active or selected
      return neutral['300'];
    });

    return [
      {
        data,
        animation: false,
        offset: 2,
        borderWidth: 0.05,
        borderColor: neutral[500],
        hoverBorderWidth: 0,
        backgroundColor: color,
        hoverBackgroundColor: color,
      },
    ];
  }, [data, tick, length, rhythm.pattern]);

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
    []
  );

  const handlePitchChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      setRhythmPitch({
        track: rhythm,
        pitch: parseInt(ev.target.value, 10),
      });
    },
    []
  );

  const handleTrackChange = React.useCallback(
    async (ev: React.ChangeEvent<HTMLSelectElement>) => {
      // get the value
      const target = config.SOUNDS[rhythm.library].find(
        (e) => e.name === ev.target.value
      );
      if (!target) {
        return;
      }

      const _value = await changeInstrument({
        track: rhythm,
        instrument: target,
      });
    },
    []
  );

  return (
    <Draggable key={rhythm.id} handle=".handle" bounds="parent">
      <section key={rhythm.id} className={styles.section}>
        <div className={styles.wrapper}>
          <nav className={clsx(styles.nav, 'handle', 'cursor-move')}>
            <IconButton muted onClick={() => undefined}>
              <MenuIcon />
            </IconButton>
            <div className="cursor-pointer -mr-2">
              <IconButton small onClick={handleDelete} muted>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </div>
          </nav>
          <div className="w-64 h-64 cursor-pointer">
            <Doughnut
              width={12}
              height={12}
              data={{ labels: [], datasets }}
              options={
                {
                  cutout: 0,
                  radius: 120,
                  events: ['click'],
                  onClick: handleClick,
                  borderColor: neutral[500],
                  borderWidth: 0.5,
                  borderAlign: 'inner',
                  hoverBorderWidth: 1,

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
          <div className="w-full px-4">
            <div>
              <label className="flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-xs">SLICES</p>
                  <div className="text-xs">
                    <Highlight>{rhythm.totalNotes}</Highlight>
                  </div>
                </div>
                <input
                  type="range"
                  min={2}
                  max={config.MAX_SLICES}
                  step={1}
                  value={rhythm.totalNotes}
                  onChange={handleTotalNoteChange}
                />
              </label>
            </div>
            <div>
              <label className="flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-xs">MIDI NOTE</p>
                  <div className="text-xs">
                    <Highlight>{rhythm.pitch}</Highlight>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={127}
                  step={1}
                  value={rhythm.pitch}
                  onChange={handlePitchChange}
                />
              </label>
            </div>
            <div className="my-2">
              <label className="flex flex-col">
                <div className="flex items-center justify-between">
                  <p className="text-xs">MACHINE</p>
                  <select value={rhythm.library} className="text-xs">
                    <option>MINIPOPS</option>
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
                    className="text-xs"
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
