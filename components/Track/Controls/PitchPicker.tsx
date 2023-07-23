import { useCallback, useRef, useState } from 'react';
import styles from './pitch.module.css';
import { Track } from '../../../lib/Track';
import { useAudioContext } from '../../../contexts/AudioContext';

function normalizeValue(value: number) {
  if (value < 0) {
    value = 0;
  }
  if (value > 1) {
    value = 1;
  }

  // Calculate the output value.
  const outputValue = 10 + value * 100;

  // Return the output value.
  return Math.round(outputValue);
}

export function PitchPicker({ rhythm }: { rhythm: Track }) {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [percent, setPercent] = useState(0.5);

  const {
    methods: { setTrackVal },
  } = useAudioContext();

  const toggleOpen = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  function slide(ev: PointerEvent) {
    const { clientY } = ev;
    const height = window.screen.availHeight;
    const perc = Math.min(Math.abs(1 - clientY / height), 1);
    setPercent(perc);
    setTrackVal(rhythm, {
      method: 'changePitch',
      value: normalizeValue(perc),
    });
  }

  const handlePointerUp = useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>) => {
      ref.current!.onpointermove = null;
      ref.current!.releasePointerCapture(ev.pointerId);
      setOpen(false);
    },
    []
  );

  const handlePointerDown = useCallback(
    (ev: React.PointerEvent<HTMLButtonElement>) => {
      ref.current!.onpointermove = slide;
      ref.current!.setPointerCapture(ev.pointerId);

      setOpen(true);
    },
    []
  );

  return (
    <>
      <button
        ref={ref}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className={styles.toggle}
      >
        P
      </button>
      {open && (
        <div className={styles.outer}>
          <div
            className={styles.inner}
            style={{ transform: `scaleY(${percent})` }}
          />
        </div>
      )}
    </>
  );
}
