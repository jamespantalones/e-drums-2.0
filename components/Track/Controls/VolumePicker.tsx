import { CSSProperties } from 'react';
import styles from './picker.module.css';
import { Track } from '../../../lib/Track';
import { useAudioContext } from '../../../contexts/AudioContext';

function normalizeValue(value: number) {
  if (value < 0) {
    value = 0;
  }
  if (value > 1) {
    value = 1;
  }

  // Calculate the output value.
  const outputValue = 0 + value * 3;

  // Return the output value.
  return Math.round(outputValue);
}

export function VolumePicker({ rhythm }: { rhythm: Track }) {
  const {
    methods: { setTrackVal },
  } = useAudioContext();

  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const num = parseFloat(ev.target.value);
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
          left: '128px',
          '--track-bg': `hsl(${rhythm.hue / 2}, ${rhythm.volume * 50}%, 50%)`,
        } as CSSProperties
      }
    >
      <label className={styles.label}>
        <span>Volume</span>
        <input
          orient="vertical"
          type="range"
          min={0}
          max={3}
          step={0.01}
          value={rhythm.volume}
          className={styles.input}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
