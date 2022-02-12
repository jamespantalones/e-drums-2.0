import * as React from 'react';
import { Highlight } from '../Highlight/Highlight';

export function TempoSlider({
  bpm,
  onChange,
}: {
  bpm: number;
  onChange: (b: number) => void;
}) {
  const handleChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      console.log(ev.target.value);
      onChange(parseFloat(ev.target.value));
    },
    [onChange]
  );

  const formatBpm = React.useCallback((bpm: number): string => {
    if (bpm < 100) {
      return `0${bpm.toFixed(1)}`;
    }

    return bpm.toFixed(1).toString();
  }, []);

  return (
    <div className="w-full font-mono text-xs">
      <label>
        <Highlight>
          <small className="text-xs">BPM: {formatBpm(bpm)}</small>
        </Highlight>
        <input
          type="range"
          min="50"
          max="220"
          step={0.1}
          value={bpm}
          onChange={handleChange}
          className="w-full mt-2"
        />
      </label>
    </div>
  );
}
