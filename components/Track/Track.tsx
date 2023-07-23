import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Slice } from './Slice';

import { InstrumentPicker } from './Controls/InstrumentPicker';
import { PitchPicker } from './Controls/PitchPicker';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [muted, setMuted] = useState(false);
  const [editPitch, setEditPitch] = useState(false);
  const [instrumentPickerOpen, setInstrumentPickerOpen] = useState(false);

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
      className={clsx(styles.section, {})}
      data-color={rhythm.color}
      style={style}
    >
      <div className={clsx(styles['slice-wrapper'], styles.group)}>
        {/* MUTE BUTTON */}
        <button
          className={clsx(styles['button-mute'], {
            [styles.muted]: muted,
          })}
          style={{ fontSize: '8px' }}
          onClick={toggleMute}
        >
          Mute
        </button>

        <InstrumentPicker
          open={instrumentPickerOpen}
          rhythm={rhythm}
          setInstrumentPickerOpen={setInstrumentPickerOpen}
        />

        <PitchPicker />

        {rhythm.pattern.map((slice, index) => (
          <Slice
            key={`${rhythm.id}-${slice}-${index}`}
            editPitch={editPitch}
            index={index}
            rhythm={rhythm}
            length={length}
            removeNote={removeNote}
          />
        ))}

        <motion.button
          onClick={addNote}
          className={styles['button-add']}
          layout
        >
          <div className={styles['button-inner']}>+</div>
        </motion.button>
      </div>
    </section>
  );
}
