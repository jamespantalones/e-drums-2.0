import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import { config } from '../../config';
import clsx from 'clsx';
import { Library } from '../../types';
import { useCallback, useMemo, useState } from 'react';
import { Settings } from '../Settings/Settings';

import { Slice } from './Slice';

export function TrackItem({ index, rhythm }: { index: number; rhythm: Track }) {
  const [expanded, setExpanded] = useState(false);
  const [editPitch, setEditPitch] = useState(false);
  const {
    methods: { deleteTrack, setRhythmTicks, changeInstrument, changeLibrary },
  } = useAudioContext();

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);

  const handleDelete = useCallback(() => {
    deleteTrack(rhythm.id);
  }, [rhythm, deleteTrack]);

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

  const handleLibraryChange = useCallback(
    (ev: React.ChangeEvent<HTMLSelectElement>) => {
      const value = ev.target.value as Library;

      changeLibrary({
        track: rhythm,
        library: value,
      });
    },
    [changeLibrary, rhythm]
  );

  const handleTrackChange = useCallback(
    async (ev: React.ChangeEvent<HTMLSelectElement>) => {
      // get the value
      const target = config.SOUNDS[rhythm.library].find(
        (e: any) => e.name === ev.target.value
      );

      if (!target) return;

      await changeInstrument({
        track: rhythm,
        instrument: target,
      });
    },
    [rhythm, changeInstrument]
  );

  const toggleOpen = useCallback(() => {
    setExpanded((e) => !e);
  }, []);

  const togglePitch = useCallback(() => {
    setEditPitch((p) => !p);
  }, []);

  return (
    <section
      className={clsx(styles.section, {
        [styles.shift]: expanded,
      })}
      data-color={rhythm.color}
      style={{ '--color-track': rhythm.color } as React.CSSProperties}
    >
      <Settings
        open={expanded}
        track={rhythm}
        toggleOpen={toggleOpen}
        handleDelete={handleDelete}
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
