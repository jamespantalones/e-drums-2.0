import clsx from 'clsx';
import styles from './Slice.module.css';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { Track } from '../../lib/Track';
import { useAudioContext } from '../../contexts/AudioContext';
import {
  PointerEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, PanInfo, motion } from 'framer-motion';
import { Config } from '../../config';
import { Draggable, Handler, Rotatable } from 'momentum.js';

export function Slice({
  index,
  editPitch,
  length,
  rhythm,
  removeNote,
  toggleParentActive,
}: {
  editPitch?: boolean;
  length: number;
  index: number;
  rhythm: Track;
  toggleParentActive: (val: boolean) => void;
  removeNote: (index: number) => void;
}) {
  const {
    state: { tick },
    methods: { toggleTick, repitchTick },
  } = useAudioContext();

  const id = useId();
  let div = useRef<HTMLDivElement>();

  const x = useRef<number | undefined>(undefined);
  const y = useRef<number | undefined>(undefined);

  const handleClick = useCallback(() => {
    toggleTick(rhythm.id, index);
  }, [rhythm, toggleTick, index]);

  const decrementPitch = useCallback(() => {
    repitchTick(rhythm.id, index, 'DECREMENT');
  }, [rhythm, repitchTick, index]);

  const incrementPitch = useCallback(() => {
    repitchTick(rhythm.id, index, 'INCREMENT');
  }, [rhythm, repitchTick, index]);

  // BUG: x.current and y.current can be undefined
  // at this point, indicating pointerdown did not fire
  const handlePointerUp = useCallback(
    (ev: PointerEvent) => {
      const d = {
        x: Math.abs(ev.clientX - x.current!),
        y: Math.abs(ev.clientY - y.current!),
      };

      if (Number.isNaN(d.x)) {
        console.log(ev.clientX, x.current);
      }

      console.log(d);
      if (
        Math.abs(ev.clientX - x.current!) > 20 ||
        Math.abs(ev.clientY - y.current!) > 20
      ) {
        console.log('REMOVE');
        removeNote(index);
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
    [handlePointerUp, index]
  );

  console.log(x.current);

  // BUG: Still a z-index issue!
  useEffect(() => {
    const d = new Draggable(div.current, {
      friction: 0.5,
      onUp: (e) => {
        console.log('up', e);
      },
    });
  });

  return (
    <div
      ref={div}
      key={`${rhythm.id}-${index}-${id}`}
      className={styles['slice-outer']}
      onPointerUp={handlePointerUp}
      onPointerDown={handlePointerDown}
      onDrag={(e) => {
        console.log(e.x, e.y);
      }}
      onDragStart={(e) => {
        // Add the class to the div while dragging
        (e.target as HTMLElement).classList.add(styles['is-dragging']);

        // bump z-index of parent

        toggleParentActive(true);
      }}
      onDragEnd={(e) => {
        // Remove the class after dragging
        (e.target as HTMLElement).classList.remove(styles['is-dragging']);
        toggleParentActive(false);
      }}
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
    </div>
  );
}
