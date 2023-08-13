import { CSSProperties } from 'react';
import styles from './picker.module.css';
import { Track } from '../../../lib/Track';
import { useAudioContext } from '../../../contexts/AudioContext';
import { Direction, Range } from 'react-range';

export function VolumePicker({ rhythm }: { rhythm: Track }) {
  const {
    methods: { setTrackVal },
  } = useAudioContext();

  function onChange(values: number[]) {
    const [num] = values;
    setTrackVal(rhythm, {
      method: 'changeVolume',
      value: num,
    });
  }

  return (
    <div
      className={styles.outer}
      style={
        {
          '--track-bg': `linear-gradient( ${rhythm.color} ${
            rhythm.volume * 100
          }%, #ececec ${100}%)`,
        } as CSSProperties
      }
    >
      <label className={styles.label}>
        <Range
          direction={Direction.Up}
          min={0}
          max={1}
          step={0.01}
          values={[rhythm.volume]}
          onChange={onChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="h-48 rounded shadow w-12 bg-white"
              style={{
                ...props.style,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-12 h-6 bg-neutral-400"
              style={{
                ...props.style,
              }}
            />
          )}
        />

        <span className="pointer-events-none text-xs absolute bottom-10 left-0">
          Volume {rhythm.volume}
        </span>
      </label>
    </div>
  );
}
