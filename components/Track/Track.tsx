import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Slice } from './Slice';
import More from '@mui/icons-material/MoreHorizOutlined';
import { IconButton } from '../IconButton/IconButton';
import { SettingsPanel } from './Controls/SettingsPanel';
import { Config } from '../../config';

export function TrackItem({ rhythm }: { index: number; rhythm: Track }) {
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
  const {
    methods: { setTrackVal, deleteTrack },
  } = useAudioContext();

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);
  const panel = useRef<HTMLDialogElement | null>(null);
  const openSettingsPanel = useCallback(() => {
    panel.current!.showModal();
  }, []);

  const closeSettingsPanel = useCallback(() => {
    console.log('hit');
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
        <IconButton
          className="mx-auto"
          noBorder
          fill="transparent"
          color="black"
          onClick={openSettingsPanel}
        >
          <More />
        </IconButton>

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
          <div className="my-2">
            <IconButton
              noBorder
              onClick={addNote}
              layout
              fill="#6a6a6a"
              color="black"
            >
              +
            </IconButton>
          </div>
        )}
      </div>
    </section>
  );
}
