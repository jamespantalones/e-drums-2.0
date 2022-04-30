import * as React from 'react';

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
    <div>
      <label className="flex flex-col">
        <div className="flex items-center justify-between">
          <p className="text-xs">{label}</p>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
        />
      </label>
    </div>
  );
}
