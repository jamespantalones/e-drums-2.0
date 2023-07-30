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
              style={{
                ...props.style,
                height: '200px',
                width: '48px',
                backgroundColor: '#eee',
                borderRadius: '5px',
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '48px',
                width: '48px',
                backgroundColor: '#999',
              }}
            />
          )}
        />

        <span>Pitch {rhythm.pitch}</span>
      </label>
    </div>
  );
}
