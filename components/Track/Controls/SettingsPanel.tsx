import { forwardRef, useState } from 'react';
import { Track } from '../../../lib/Track';
import { InstrumentPicker } from './InstrumentPicker';
import { PitchPicker } from './PitchPicker';
import { VolumePicker } from './VolumePicker';
import styles from './settingsPanel.module.css';
import clsx from 'clsx';
import { useAudioContext } from '../../../contexts/AudioContext';

export type Props = {
  open: boolean;
  close: () => void;
  rhythm: Track;
};

export const SettingsPanel = forwardRef<HTMLDialogElement, Props>(
  function Component(props, ref) {
    const {
      methods: { deleteTrack },
    } = useAudioContext();
    const { close, open, rhythm } = props;
    const [instrumentPickerOpen, setInstrumentPickerOpen] = useState(false);

    return (
      <dialog
        ref={ref}
        open={open}
        className={clsx(styles.dialog, {
          [styles.open]: open,
        })}
        onClick={close}
      >
        <div className={styles.inner}>
          <h1>{rhythm.instrument?.sound.name}</h1>

          <InstrumentPicker rhythm={rhythm} />

          <button
            className="button text-xs mx-auto w-full"
            onClick={() => deleteTrack(rhythm.id)}
          >
            DEL
          </button>

          <VolumePicker rhythm={rhythm} />
          <PitchPicker rhythm={rhythm} />
        </div>
      </dialog>
    );
  }
);
