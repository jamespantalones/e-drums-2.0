import { useState } from 'react';
import { Basic, White } from 'react-dial-knob';
import styles from './Knob.module.css';

// https://codepen.io/oscicen/details/LMjLLq

export function Knob({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (val: number) => void;
  value: number;
}) {
  return (
    <div className={styles.wrapper}>
      <label className="text-xxs">
        {label}
        <White
          diameter={30}
          min={0}
          max={100}
          step={1}
          value={value}
          style={{
            background: 'transparent',
            color: 'blue',
          }}
          theme={{
            defaultNotchColor: 'var(--color-bg)',
            activeNotchColor: 'var(--color-text)',
            activeTextColor: 'var(--color-text)',
            defaultTextColor: 'var(--color-text)',
          }}
          onValueChange={onChange}
          ariaLabelledBy={'my-label'}
        ></White>
      </label>
    </div>
  );
}
