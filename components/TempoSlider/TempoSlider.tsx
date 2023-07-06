import { useCallback } from 'react';
import { config } from '../../config';
import { TrackInput } from '../Track/TrackInput';

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
      <TrackInput
        label="BPM"
        min={config.MIN_BPM}
        max={config.MAX_BPM}
        step={0.2}
        value={bpm}
        onChange={handleChange}
      />
    </div>
  );
}
