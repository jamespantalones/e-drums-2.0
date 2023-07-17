import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { Settings } from '../Track/Settings';

import { Slice } from './Slice';
import { Config, SOUNDS } from '../../config';
import { SoundFile } from '../../types';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [expanded, setExpanded] = useState(false);
  const [editPitch, setEditPitch] = useState(false);
  const {
    methods: { setTrackVal, deleteTrack },
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
      let ticks: number;
      console.log('rhythm', rhythm.totalNotes);
      if (rhythm.totalNotes - 1 === 0) {
        ticks = rhythm.totalNotes;
        // delete track
        deleteTrack(rhythm.id);
      } else {
        ticks = rhythm.totalNotes - 1;
      }
      setTrackVal(rhythm, { method: 'setRhythmTicks', value: ticks });
    },
    [rhythm, setTrackVal, deleteTrack]
  );

  const togglePitch = useCallback(() => {
    setEditPitch((p) => !p);
  }, []);

  const changeInstrument = useCallback(() => {
    const currentInstIndex = SOUNDS.findIndex(
      (s) => s.name === rhythm.instrument?.sound.name
    );

    const nextSoundIndex =
      currentInstIndex + 1 > SOUNDS.length ? 0 : currentInstIndex + 1;

    setTrackVal(rhythm, {
      method: 'changeInstrument',
      value: SOUNDS[nextSoundIndex] as SoundFile,
    });
  }, [rhythm, setTrackVal]);

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
        <button
          style={{ fontSize: '8px' }}
          onClick={changeInstrument}
          className="bg-neutral-800 p-2 w-8/12 h-8 flex items-center justify-center mx-auto my-2"
        >
          {rhythm.instrument?.sound.name}
        </button>
        {rhythm.pattern.map((slice, index) => (
          <Slice
            key={`${slice}-${index}`}
            editPitch={editPitch}
            index={index}
            rhythm={rhythm}
            length={length}
            handleTotalNoteChangeDecrement={handleTotalNoteChangeDecrement}
          />
        ))}
        <button
          onClick={handleTotalNoteChangeIncrement}
          className="bg-neutral-800 p-2 w-8/12 h-8 flex items-center justify-center mx-auto my-2"
        >
          +
        </button>
      </div>
    </section>
  );
}
