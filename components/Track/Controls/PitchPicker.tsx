import { CSSProperties } from 'react';
import styles from './picker.module.css';
import { Track } from '../../../lib/Track';
import { useAudioContext } from '../../../contexts/AudioContext';

export function PitchPicker({ rhythm }: { rhythm: Track }) {
  const {
    methods: { setTrackVal },
  } = useAudioContext();

  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const num = parseFloat(ev.target.value);
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
        <span>Pitch</span>
        <input
          orient="vertical"
          type="range"
          min={0}
          max={100}
          step={1}
          value={rhythm.pitch}
          className={styles.input}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
