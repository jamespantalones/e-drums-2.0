import { ActiveElement, ChartEvent } from 'chart.js';
import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { neutral, yellow } from 'tailwindcss/colors';
import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';

export function TrackItem({ rhythm }: { rhythm: Track }) {
  const length = rhythm.pattern.length;

  const {
    state: { tick },
    methods: { toggleTick },
  } = useAudioContext();

  const data = React.useMemo(() => {
    return new Array(length).fill(Math.round(100 / length));
  }, [length]);

  const handleClick = React.useCallback(
    (_ev: ChartEvent, elements: ActiveElement[]) => {
      const [item] = elements;
      toggleTick(rhythm.id, item.index);
    },
    [rhythm, toggleTick]
  );

  const datasets = React.useMemo(() => {
    const color = new Array(length).fill(0).map((_val, i) => {
      const active = tick % length === i;
      const enabled = rhythm.pattern[i];

      console.log(yellow);

      // if slice is enabled, but not currently triggered
      if (active && !enabled) {
        return neutral['300'];
      }

      // if slice is enabled, and triggered
      if (active && enabled) {
        return yellow['500'];
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

  return (
    <div key={rhythm.id} className="w-auto p-2 flex-grow-0">
      <div className="shadow-xl rounded-lg p-2 bg-gray-200">
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
        <div className="my-2 mx-auto text-center">
          <label>Time</label>
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
    </div>
  );
}
