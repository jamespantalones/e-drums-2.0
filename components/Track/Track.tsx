import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import VolumeMuteIcon from '@mui/icons-material/VolumeMute';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slice } from './Slice';
import More from '@mui/icons-material/MoreHorizOutlined';
import { SettingsPanel } from './Controls/SettingsPanel';
import { Config } from '../../config';
import { IconButton } from '../IconButton/IconButton';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const {
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
          <button color="black" onClick={toggleMute}>
            {muted ? (
              <span className="bg-red-500 block hover:bg-red-100 active:bg-red-400">
                <VolumeMuteIcon />
              </span>
            ) : (
              <span className="hover:bg-red-100 block">
                <VolumeDownIcon />
              </span>
            )}
          </button>
          <button color="black" onClick={openSettingsPanel}>
            <More />
          </button>
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
              noBorder
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
