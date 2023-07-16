import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { Settings } from '../Settings/Settings';

import { Slice } from './Slice';
import { Config } from '../../config';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [expanded, setExpanded] = useState(false);
  const [editPitch, setEditPitch] = useState(false);
  const {
    methods: { setTrackVal },
  } = useAudioContext();

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);

  const handleTotalNoteChangeIncrement = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      const ticks =
        rhythm.totalNotes + 1 > Config.MAX_SLICES
          ? rhythm.totalNotes
          : rhythm.totalNotes + 1;
      setTrackVal(rhythm, { method: 'setRhythmTicks', value: ticks });
    },
    [rhythm, setTrackVal]
  );

  const handleTotalNoteChangeDecrement = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      const ticks =
        rhythm.totalNotes - 1 < 2 ? rhythm.totalNotes : rhythm.totalNotes - 1;
      setTrackVal(rhythm, { method: 'setRhythmTicks', value: ticks });
    },
    [rhythm, setTrackVal]
  );

  const togglePitch = useCallback(() => {
    setEditPitch((p) => !p);
  }, []);

  const style: React.CSSProperties = {
    '--color-track': rhythm.color,
  } as React.CSSProperties;

  return (
    <section
      className={clsx(styles.section, {
        [styles.shift]: expanded,
      })}
      data-color={rhythm.color}
      style={style}
    >
      <Settings
        pitchEditOn={editPitch}
        track={rhythm}
        handleTotalNoteChangeDecrement={handleTotalNoteChangeDecrement}
        handleTotalNoteChangeIncrement={handleTotalNoteChangeIncrement}
        togglePitch={togglePitch}
      />
      <div className={clsx(styles['slice-wrapper'], styles.group)}>
        {rhythm.pattern.map((slice, index) => (
          <Slice
            key={`${slice}-${index}`}
            editPitch={editPitch}
            index={index}
            rhythm={rhythm}
            length={length}
          />
        ))}
      </div>
    </section>
  );
}
