import DragHandle from '@mui/icons-material/DragHandle';
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
export function TrackItem({ rhythm }: { rhythm: Track }) {
  const length = rhythm.pattern.length;
  const nodeRef = React.useRef<HTMLDivElement | null>(null);

  const {
    state: { tick },
    methods: { toggleTick, deleteTrack },
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
        return neutral['300'];
      }

      // if slice is enabled, and triggered
      if (active && enabled) {
        return blue['500'];
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
        offset: 2,
        borderWidth: 0,
        hoverBorderWidth: 0,
        backgroundColor: color,
        hoverBackgroundColor: color,
      },
    ];
  }, [data, tick, length, rhythm.pattern]);

  const handleDelete = React.useCallback(() => {
    deleteTrack(rhythm.id);
  }, [rhythm, deleteTrack]);

  return (
    <Draggable key={rhythm.id} handle=".handle">
      <section key={rhythm.id} className={styles.section}>
        <div className={styles.wrapper}>
          <nav className={styles.nav}>
            <div
              ref={nodeRef}
              className="handle flex items-center justify-center w-6 h-6 cursor-move text-neutral-500"
            >
              <DragHandle />
            </div>
            <div>
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
              options={{
                cutout: 0,
                radius: 120,
                events: ['click'],
                onClick: handleClick,
                borderColor: 'black',
                borderWidth: 0.05,
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
              }}
            />
          </div>
          {/* <div className="my-2 mx-auto text-center">
          <label>Ticks</label>
          <button className="button x-auto" onClick={decrementTick(rhythm)}>
            -
          </button>
          <button className="button mx-auto" onClick={incrementTick(rhythm)}>
            +
          </button>
        </div>
        <div>
          <input
            type="range"
            min={0}
            max={500}
            defaultValue={rhythm.note}
            onChange={changeFrequency(rhythm)}
          />
        </div>
        <div>
          <button onClick={deleteTrack(rhythm)}>Delete</button>
        </div> */}
        </div>
      </section>
    </Draggable>
  );
}
