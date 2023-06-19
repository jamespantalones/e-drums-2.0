import { useCallback } from 'react';

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
          min="50"
          max="180"
          step={0.1}
          value={bpm}
          onChange={handleChange}
          className="w-full mt-2"
        />
      </label>
    </div>
  );
}
