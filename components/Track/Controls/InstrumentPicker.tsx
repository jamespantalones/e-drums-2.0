import { useCallback, useEffect } from 'react';
import { useAudioContext } from '../../../contexts/AudioContext';
import { Track } from '../../../lib/Track';
import { SOUNDS } from '../../../config';
import { SoundFile } from '../../../types';
import styles from './instrument.module.css';
import clsx from 'clsx';

export type Props = {
  open: boolean;
  rhythm: Track;
};

export function InstrumentPicker(props: Props) {
  const { rhythm, open } = props;

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

  useEffect(() => {
    if (open) {
      console.log('MOUNT');
    }
  }, [open]);

  return (
    <div className={styles.outer}>
      {SOUNDS.map((sound) => (
        <button
          data-name={sound.name}
          className={clsx(styles.button, {
            [styles.active]: rhythm.instrument?.sound.name === sound.name,
          })}
          key={sound.name}
          onClick={handleClick(sound)}
        >
          {sound.name}
        </button>
      ))}
    </div>
  );
}
