import * as React from 'react';
import styles from './TrackInput.module.css';

export type TrackInputProps = {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
};
export function TrackInput(props: TrackInputProps) {
  const { label, min = 0, max = 1000, step = 1, value, onChange } = props;
  return (
    <div className={styles.wrapper}>
      <label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        />
        <p className="text-xs">{label}</p>
      </label>
    </div>
  );
}
