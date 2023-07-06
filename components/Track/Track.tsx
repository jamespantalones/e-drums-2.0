import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import { config } from '../../config';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { Settings } from '../Settings/Settings';

import { Slice } from './Slice';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [expanded, setExpanded] = useState(false);
  const [editPitch, setEditPitch] = useState(false);
  const {
    methods: { deleteTrack, setRhythmTicks, changeInstrument, setRhythmVolume },
  } = useAudioContext();

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);

  const handleTotalNoteChangeIncrement = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      setRhythmTicks({
        track: rhythm,
        ticks:
          rhythm.totalNotes + 1 > config.MAX_SLICES
            ? rhythm.totalNotes
            : rhythm.totalNotes + 1,
      });
    },
    [rhythm, setRhythmTicks]
  );

  const handleTotalNoteChangeDecrement = useCallback(
    (ev: React.MouseEvent<HTMLButtonElement>) => {
      setRhythmTicks({
        track: rhythm,
        ticks:
          rhythm.totalNotes - 1 < 2 ? rhythm.totalNotes : rhythm.totalNotes - 1,
      });
    },
    [rhythm, setRhythmTicks]
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
        changeInstrument={changeInstrument}
      />
      <div
        className={clsx(styles['slice-wrapper'], styles.group, {
          [styles.shift]: expanded,
        })}
      >
        {rhythm.pattern.map((slice, index) => (
          <Slice
            key={`${slice}-${index}`}
            editPitch={editPitch}
            expanded={expanded}
            index={index}
            rhythm={rhythm}
            length={length}
          />
        ))}
      </div>
    </section>
  );
}
