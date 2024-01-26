import styles from './slider.module.css';

export type Props = {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

export function Slider(props: Props) {
  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    props.onChange(+ev.target.value);
  }
  return (
    <label className={styles.slider}>
      <input type="range" onChange={handleChange} />
    </label>
  );
}
