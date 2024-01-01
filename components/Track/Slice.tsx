import clsx from 'clsx';
import styles from './Slice.module.css';
import { Plus as Add, Minus as Remove } from 'lucide-react';
import { Track } from '../../lib/Track';
import { useAudioContext } from '../../contexts/AudioContext';
import { PointerEvent, useCallback, useId, useMemo, useRef } from 'react';

export function Slice({
  index,
  editPitch,
  length,
  rhythm,
  removeNote,
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

  return (
    <div key={`${rhythm.id}-${index}-${id}`} className={styles['slice-outer']}>
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
