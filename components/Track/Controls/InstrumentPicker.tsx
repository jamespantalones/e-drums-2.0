import { useCallback } from 'react';
import { useAudioContext } from '../../../contexts/AudioContext';
import { Track } from '../../../lib/Track';
import { SOUNDS } from '../../../config';
import { SoundFile } from '../../../types';

export type Props = {
  rhythm: Track;
};

export function InstrumentPicker(props: Props) {
  const { rhythm } = props;

  const {
    methods: { setTrackVal },
  } = useAudioContext();

  const handleClick = useCallback(
    (sound: SoundFile) => {
      return function handler(ev: React.PointerEvent<HTMLButtonElement>) {
        ev.preventDefault();
        ev.stopPropagation();
        setTrackVal(rhythm, {
          method: 'changeInstrument',
          value: sound,
        });
      };
    },
    [setTrackVal, rhythm]
  );

  return (
    <div className="w-full h-48 overflow-y-scroll border border-black p-1">
      {SOUNDS.map((sound) => (
        <button
          className="block text-xs w-full text-left py-2"
          key={sound.name}
          onClick={handleClick(sound)}
        >
          {sound.name}
        </button>
      ))}
    </div>
  );
}
