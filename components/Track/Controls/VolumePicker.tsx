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
          max={2}
          step={0.01}
          values={[rhythm.volume]}
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

        <span>Volume {rhythm.volume}</span>
      </label>
    </div>
  );
}
