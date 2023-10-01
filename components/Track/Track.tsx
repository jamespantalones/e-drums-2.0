import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import clsx from 'clsx';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Slice } from './Slice';
import More from '@mui/icons-material/MoreHorizOutlined';
import { SettingsPanel } from './Controls/SettingsPanel';
import { Config, SOUNDS } from '../../config';
import { IconButton } from '../IconButton/IconButton';
import { TempoInput } from '../Nav/TempoInput';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const {
    methods,
    methods: { setTrackVal, deleteTrack },
  } = useAudioContext();

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);

  const panel = useRef<HTMLDialogElement | null>(null);

  const openSettingsPanel = useCallback(() => {
    panel.current!.showModal();
    setSettingsPanelOpen(true);
  }, []);

  const closeSettingsPanel = useCallback(() => {
    setSettingsPanelOpen(false);
    panel.current!.close();
  }, []);

  const addNote = useCallback(() => {
    setTrackVal(rhythm, { method: 'addNote' });
  }, [rhythm, setTrackVal]);

  const removeNote = useCallback(
    (index: number) => {
      setTrackVal(rhythm, { method: 'removeNote', value: index });
    },
    [rhythm, setTrackVal]
  );

  const toggleMute = useCallback(() => {
    const track = rhythm.toggleMute();
    setMuted(track.muted);
  }, [rhythm]);

  const style: React.CSSProperties = {
    '--color-track': rhythm.color,
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
        <div className={styles.edit}>
          <div className={styles['top-edit-row']}>
            <button
              onClick={toggleMute}
              className={clsx({
                [styles['toggle-mute']]: true,
                [styles.muted]: rhythm.muted,
              })}
            ></button>
            <div>
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

          <input type="range" value={rhythm.pitch} />

          <button
            className="text-xxs p-2"
            onClick={() => deleteTrack(rhythm.id)}
          >
            DELETE
          </button>

          <p>knobs here</p>

          {/* <button color="black" onClick={openSettingsPanel}>
            <More />
          </button> */}
        </div>

        <SettingsPanel
          ref={panel}
          open={settingsPanelOpen}
          rhythm={rhythm}
          close={closeSettingsPanel}
        />

        {rhythm.pattern.map((slice, index) => (
          <Slice
            key={`${rhythm.id}-${slice}-${index}`}
            index={index}
            rhythm={rhythm}
            length={length}
            removeNote={removeNote}
          />
        ))}

        {rhythm.totalNotes < Config.MAX_SLICES && (
          <div>
            <IconButton
              onClick={addNote}
              layout
              color="black"
              transition={{ duration: 0.2 }}
            >
              <div className={styles['add-button']}>
                <span className="-translate-y-0.5">+</span>
              </div>
            </IconButton>
          </div>
        )}
      </div>
    </section>
  );
}
