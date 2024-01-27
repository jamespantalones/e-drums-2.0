import { useState } from 'react';
import styles from './slider.module.css';
import { padNumber } from '../../utils';

export type Props = {
  value: number;
  label: string;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function Slider(props: Props) {
  const [val, setVal] = useState<number>(props.value);

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setVal(+ev.target.value);
    props.onChange(+ev.target.value);
  }

  const attrs = {
    ...(props.max && {
      max: props.max,
    }),
    ...(props.min && {
      min: props.min,
    }),
    ...(props.step && {
      step: props.step,
    }),
  };

  return (
    <label className={styles.slider}>
      <input type="range" onChange={handleChange} value={val} {...attrs} />
      <span>
        {props.label} {padNumber(val)}
      </span>
    </label>
  );
}
