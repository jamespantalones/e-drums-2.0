import clsx from 'clsx';
import styles from './Slice.module.css';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { Track } from '../../lib/Track';
import { useAudioContext } from '../../contexts/AudioContext';
import { useCallback, useId, useRef } from 'react';
import { AnimatePresence, PanInfo, motion } from 'framer-motion';

export function Slice({
  index,
  editPitch,
  length,
  rhythm,
}: {
  editPitch?: boolean;
  length: number;
  index: number;
  rhythm: Track;
}) {
  const {
    state: { tick },
    methods: { toggleTick, repitchTick },
  } = useAudioContext();

  const id = useId();

  const handleClick = useCallback(() => {
    toggleTick(rhythm.id, index);
  }, [rhythm, toggleTick, index]);

  const decrementPitch = useCallback(() => {
    repitchTick(rhythm.id, index, 'DECREMENT');
  }, [rhythm, repitchTick, index]);

  const incrementPitch = useCallback(() => {
    repitchTick(rhythm.id, index, 'INCREMENT');
  }, [rhythm, repitchTick, index]);

  return (
    <AnimatePresence>
      <motion.div
        key={`${rhythm.id}-${index}-${id}`}
        className={styles['slice-outer']}
      >
        {!editPitch && (
          <button
            key={index}
            className={clsx(styles.slice, {
              [styles.active]: tick % length === index,
              [styles.enabled]: rhythm.pattern[index],
            })}
            type="button"
            onClick={handleClick}
          />
        )}
        {editPitch && (
          <div
            className={clsx(styles.slice, {
              [styles.active]: tick % length === index,
              [styles.enabled]: rhythm.pattern[index],
            })}
          >
            {rhythm.pattern[index] > 0 && (
              <>
                <button
                  className={clsx(styles.pitch, styles.top)}
                  onClick={incrementPitch}
                >
                  <Add />
                </button>
                <button
                  className={clsx(styles.pitch, styles.bottom)}
                  onClick={decrementPitch}
                >
                  <Remove />
                </button>
              </>
            )}

            {rhythm.pattern[index] === 0 && (
              <button
                className={styles.toggle}
                key={index}
                type="button"
                onClick={handleClick}
              />
            )}

            {rhythm.pattern[index] > 0 && (
              <div className={styles['pitch-overlay']}>
                <span>{rhythm.pitchOffset[index]}</span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
