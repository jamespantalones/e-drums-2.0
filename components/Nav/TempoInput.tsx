import { useCallback } from 'react';
import styles from './TempoInput.module.css';

export function TempoInput({
  onChange,
  label,
  value,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (ev.target.value) {
        onChange(parseFloat(ev.target.value));
      }
    },
    [onChange]
  );

  return (
    <label className={styles.label}>
      {label}
      <input
        value={value}
        type="number"
        min="50"
        max="300"
        onChange={handleChange}
        className={styles.input}
      />
    </label>
  );
}
