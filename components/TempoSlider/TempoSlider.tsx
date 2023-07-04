import { useCallback } from 'react';
import { config } from '../../config';

export function TempoSlider({
  bpm,
  onChange,
}: {
  bpm: number;
  onChange: (b: number) => void;
}) {
  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      onChange(parseFloat(ev.target.value));
    },
    [onChange]
  );

  return (
    <div className="w-full">
      <label>
        <input
          type="range"
          min={config.MIN_BPM}
          max={config.MAX_BPM}
          step={0.2}
          value={bpm}
          onChange={handleChange}
          className="w-full mt-2"
        />
      </label>
    </div>
  );
}
