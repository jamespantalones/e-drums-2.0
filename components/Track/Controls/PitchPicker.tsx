import { CSSProperties } from 'react';
import styles from './picker.module.css';
import { Track } from '../../../lib/Track';
import { useAudioContext } from '../../../contexts/AudioContext';
import { Direction, Range } from 'react-range';

export function PitchPicker({ rhythm }: { rhythm: Track }) {
  const {
    methods: { setTrackVal },
  } = useAudioContext();

  function onChange(values: number[]) {
    const [num] = values;
    setTrackVal(rhythm, {
      method: 'changePitch',
      value: num,
    });
  }

  return (
    <div
      className={styles.outer}
      style={
        {
          '--track-bg': `hsl(${rhythm.hue}, ${rhythm.pitch}%, 50%)`,
        } as CSSProperties
      }
    >
      <label className={styles.label}>
        <Range
          step={1}
          direction={Direction.Up}
          min={0}
          max={100}
          values={[rhythm.pitch]}
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

        <span className="pointer-events-none">Pitch {rhythm.pitch}</span>
      </label>
    </div>
  );
}
