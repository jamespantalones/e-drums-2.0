import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import clsx from 'clsx';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Slice } from './Slice';
import { Config, SOUNDS } from '../../config';
import { Knob } from '../inputs/Knob';
import { Reorder, useDragControls } from 'framer-motion';

export function TrackItem({
  rhythm,
  mobile,
}: {
  index: number;
  rhythm: Track;
  mobile: boolean;
}) {
  const {
    methods: { setTrackVal, deleteTrack },
    sequencer,
  } = useAudioContext();

  const [muted, setMuted] = useState(rhythm.muted);
  const [soloed, setSoloed] = useState(rhythm.soloed);

  const [editPitch, setEditPitch] = useState(false);
  const controls = useDragControls();
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

  const toggleEditPitch = useCallback(() => {
    setEditPitch((p) => !p);
  }, []);

  const toggleMute = useCallback(() => {
    rhythm.toggleMute();
    setMuted((m) => !m);
  }, [rhythm]);

  const toggleSolo = useCallback(() => {
    sequencer?.clearSolos();

    setSoloed((m) => {
      const s = !m;
      if (s) {
        setMuted(false);
      }
      return s;
    });
  }, [rhythm]);

  // console.log({ color: rhythm.color });

  const style: React.CSSProperties = {
    '--color-track-h': rhythm.color[0],
    '--color-track-s': `${rhythm.color[1]}%`,
    '--color-track-l': `${rhythm.color[2]}%`,
  } as React.CSSProperties;

  const handleInstrumentChange = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const target = SOUNDS.find((s) => s.name === ev.target.value);
      if (target) {
        setTrackVal(rhythm, {
          method: 'changeInstrument',
          value: target,
        });
      }
    },
    [setTrackVal, rhythm]
  );

  const handlePitchChange = useCallback(
    (val: number) => {
      if (val) {
        setTrackVal(rhythm, {
          method: 'changePitch',
          value: val,
        });
      }
    },
    [setTrackVal, rhythm]
  );

  const handleVolumeChange = useCallback(
    (val: number) => {
      if (val) {
        // scale the value
        setTrackVal(rhythm, {
          method: 'changeVolume',
          value: val,
        });
      }
    },
    [setTrackVal, rhythm]
  );

  useEffect(() => {
    if (rhythm.pattern.length === 0) {
      deleteTrack(rhythm.id);
    }
  }, [rhythm.pattern.length, rhythm.id, deleteTrack]);

  return (
    <Reorder.Item
      value={rhythm}
      className={clsx(styles.section, {})}
      data-color={rhythm.color}
      style={style}
    >
      <div className={clsx(styles['track-wrapper'], styles.group)}>
        {/* MUTE BUTTON */}
        <div className={styles.edit}>
          <div className={styles['top-edit-row']}>
            <div
              className={styles.grab}
              onPointerDown={(event) => controls.start(event)}
            />
            <div className="flex justify-between">
              <button
                onClick={toggleSolo}
                className={clsx('mr-1', {
                  [styles['toggle-solo']]: true,
                  [styles.solo]: soloed,
                })}
              >
                S
              </button>
              <button
                onClick={toggleMute}
                className={clsx({
                  [styles['toggle-mute']]: true,
                  [styles.muted]: muted,
                })}
              >
                M
              </button>
            </div>
          </div>

          <div className="text-xs">
            <span className="text-xs bg-foreground w-4 h-4  text-center flex items-center justify-center rounded-full text-background">
              {rhythm.totalNotes}
            </span>
          </div>

          <div className={styles['button-wrapper']}>
            <button
              className={styles['add-button']}
              onClick={() => removeNote(rhythm.pattern.length - 1)}
              disabled={rhythm.pattern.length <= 1}
            >
              <div>
                <span>-</span>
              </div>
            </button>
            <button
              className={styles['add-button']}
              onClick={addNote}
              color="black"
              disabled={rhythm.totalNotes >= Config.MAX_SLICES}
            >
              <div>
                <span>+</span>
              </div>
            </button>
          </div>

          <div className="flex w-full items-center justify-between px-2">
            <Knob
              label="pitch"
              step={1}
              onChange={handlePitchChange}
              value={rhythm.pitch}
              min={30}
              max={70}
            />
            <Knob
              onChange={handleVolumeChange}
              value={rhythm.prevVolume}
              label="vol"
              min={0}
              max={100}
              step={1}
            />
          </div>
          <div className="flex items-center justify-between w-full my-1 px-2">
            <button
              onClick={toggleEditPitch}
              className={clsx(styles['edit-pitch-button'], {
                [styles.active]: editPitch,
              })}
            >
              PITCH
            </button>
            <button
              onClick={() => deleteTrack(rhythm.id)}
              className={styles['delete-slice-button']}
            >
              -
            </button>
          </div>

          <div className="text-xs">
            <select
              value={rhythm.instrument?.sound.name}
              className={styles['edit-name']}
              onChange={handleInstrumentChange}
            >
              {SOUNDS.map((sound) => (
                <option key={sound.name} value={sound.name}>
                  {sound.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {rhythm.pattern.map((slice, index) => (
          <div key={`${rhythm.id}-${slice}-${index}`}>
            <Slice
              key={`${rhythm.id}-${slice}-${index}`}
              index={index}
              rhythm={rhythm}
              length={length}
              editPitch={editPitch}
              removeNote={removeNote}
              mobile={mobile}
            />
          </div>
        ))}
      </div>
    </Reorder.Item>
  );
}
