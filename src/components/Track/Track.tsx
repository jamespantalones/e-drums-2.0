import { useAudioContext } from '../../contexts/AudioContext';
import { Track } from '../../lib/Track';
import styles from './Track.module.css';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Slice } from './Slice';

import { Reorder, useDragControls } from 'framer-motion';
import { Edit } from './Edit';
import { useDeleteTrackOnEmpty } from './useDeleteTrackOnEmpty';

export function TrackItem({
  rhythm,
  mobile,
}: {
  index: number;
  rhythm: Track;
  mobile: boolean;
}) {
  const {
    methods: { setTrackVal },
  } = useAudioContext();

  const [editPitch, setEditPitch] = useState(false);

  const { length } = useMemo(() => rhythm.pattern, [rhythm.pattern]);

  const removeNote = useCallback(
    (index: number) => {
      setTrackVal(rhythm, { method: 'removeNote', value: index });
    },
    [rhythm, setTrackVal]
  );

  const dragControls = useDragControls();

  // console.log({ color: rhythm.color });

  const style: React.CSSProperties = {
    '--color-track-h': rhythm.color[0],
    '--color-track-s': `${rhythm.color[1]}%`,
    '--color-track-l': `${rhythm.color[2]}%`,
  } as React.CSSProperties;

  useDeleteTrackOnEmpty(rhythm);

  return (
    <Reorder.Item
      value={rhythm}
      className={clsx(styles.section, {})}
      data-color={rhythm.color}
      style={style}
      dragListener={false}
      dragControls={dragControls}
    >
      <div className={clsx(styles['track-wrapper'], styles.group)}>
        <Edit
          rhythm={rhythm}
          removeNote={removeNote}
          editPitch={editPitch}
          setEditPitch={setEditPitch}
          dragControls={dragControls}
        />

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
