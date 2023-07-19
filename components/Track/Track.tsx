import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Settings } from '../Track/Settings';

import { Slice } from './Slice';
import { SOUNDS } from '../../config';
import { SoundFile } from '../../types';
import MoreVert from '@mui/icons-material/MoreVert';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editPitch, setEditPitch] = useState(false);
  const {
    methods: { setTrackVal, deleteTrack },
  } = useAudioContext();

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);

  const addNote = useCallback(() => {
    setTrackVal(rhythm, { method: 'addNote' });
  }, [rhythm, setTrackVal]);

  const removeNote = useCallback(
    (index: number) => {
      setTrackVal(rhythm, { method: 'removeNote', value: index });
    },
    [rhythm, setTrackVal]
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

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
    rhythm.toggleMute();
  }, []);

  const style: React.CSSProperties = {
    '--color-track': rhythm.color,
  } as React.CSSProperties;

  useEffect(() => {
    if (rhythm.pattern.length === 0) {
      deleteTrack(rhythm.id);
    }
  }, [rhythm.pattern.length, rhythm.id, deleteTrack]);

  return (
    <section
      className={clsx(styles.section, {
        [styles.shift]: expanded,
      })}
      data-color={rhythm.color}
      style={style}
    >
      <div className={clsx(styles['slice-wrapper'], styles.group)}>
        <button
          className={clsx(
            'bg-neutral-800',
            'p-1',
            'w-8/12',
            'h-auto',
            'flex',
            'uppercase',
            'items-center',
            'justify-center',
            'mx-auto',
            'my-1',
            {
              'bg-red-400': muted,
            }
          )}
          style={{ fontSize: '8px' }}
          onClick={toggleMute}
        >
          Mute
        </button>
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
            removeNote={removeNote}
          />
        ))}
        <button
          onClick={addNote}
          className="bg-neutral-800 p-2 w-8/12 h-8 flex items-center justify-center mx-auto my-2"
        >
          +
        </button>
      </div>
    </section>
  );
}
