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
          step={0.2}
          direction={Direction.Up}
          min={30}
          max={100}
          values={[rhythm.pitch]}
          onChange={onChange}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className={styles.track}
              style={{
                ...props.style,
                background: `linear-gradient(to top, ${rhythm.color}, ${rhythm.color} ${rhythm.pitch}%, white ${rhythm.pitch}%, white)`,
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="w-12 h-6 bg-transparent"
              style={{
                ...props.style,
              }}
            />
          )}
        />

        <span className="pointer-events-none">
          Pitch <br />
          {rhythm.pitch}
        </span>
      </label>
    </div>
  );
}
