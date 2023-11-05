import clsx from 'clsx';
import styles from './Slice.module.css';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { Track } from '../../lib/Track';
import { useAudioContext } from '../../contexts/AudioContext';
import { PointerEvent, useCallback, useId, useMemo, useRef } from 'react';
import { AnimatePresence, PanInfo, motion } from 'framer-motion';
import { Config } from '../../config';

export function Slice({
  index,
  editPitch,
  length,
  rhythm,
  removeNote,
  mobile,
}: {
  editPitch?: boolean;
  length: number;
  index: number;
  rhythm: Track;
  mobile: boolean;
  removeNote?: (index: number) => void;
}) {
  const {
    state: { tick },
    methods: { toggleTick, repitchTick },
  } = useAudioContext();

  const id = useId();
  const x = useRef<number>();
  const y = useRef<number>();

  const handleClick = useCallback(() => {
    toggleTick(rhythm.id, index);
  }, [rhythm, toggleTick, index]);

  const decrementPitch = useCallback(() => {
    repitchTick(rhythm.id, index, 'DECREMENT');
  }, [rhythm, repitchTick, index]);

  const incrementPitch = useCallback(() => {
    repitchTick(rhythm.id, index, 'INCREMENT');
  }, [rhythm, repitchTick, index]);

  const handlePointerUp = useCallback(
    (ev: PointerEvent) => {
      if (
        Math.abs(ev.clientX - x.current!) > 20 ||
        Math.abs(ev.clientY - y.current!) > 20
      ) {
        removeNote && removeNote(index);
      }

      window.onpointerup = null;
    },
    [removeNote, index]
  );

  const handlePointerDown = useCallback(
    (ev: PointerEvent<HTMLElement>) => {
      x.current = ev.clientX;
      y.current = ev.clientY;

      // @ts-expect-error
      window.onpointerup = handlePointerUp;
    },
    [handlePointerUp]
  );

  /**
   * On mobile, add ability to drag
   */
  const dragAttributes = useMemo(() => {
    if (mobile) {
      return {
        drag: rhythm.totalNotes > Config.MIN_SLICES,
        whileDrag: {
          scale: 0.8,
          zIndex: 99999999999,
          opacity: 0.7,
        },
        dragElastic: 0.1,
        dragMomentum: false,
        dragSnapToOrigin: true,
        dragTransition: { bounceStiffness: 900, bounceDamping: 50 },
        dragConstraints: { left: -50, right: 50, top: -50, bottom: 50 },
        layout: true,
        onPointerUp: handlePointerUp,
        onPointerDown: handlePointerDown,
        onDragStart: (e: any) => {
          // Add the class to the div while dragging
          (e.target as HTMLElement).classList.add(styles['is-dragging']);
        },
        onDragEnd: (e: any) => {
          // Remove the class after dragging
          (e.target as HTMLElement).classList.remove(styles['is-dragging']);
        },
      };
    }
    return undefined;
  }, [mobile, handlePointerDown, handlePointerUp, rhythm.totalNotes]);

  return (
    <AnimatePresence>
      <motion.div
        key={`${rhythm.id}-${index}-${id}`}
        className={styles['slice-outer']}
        {...dragAttributes}
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
