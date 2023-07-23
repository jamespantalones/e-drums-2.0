import {
  FloatingFocusManager,
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  size,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListNavigation,
  useRole,
} from '@floating-ui/react';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { useAudioContext } from '../../../contexts/AudioContext';
import { Track } from '../../../lib/Track';
import { SOUNDS } from '../../../config';
import { SoundFile } from '../../../types';
import styles from './instrument.module.css';
import clsx from 'clsx';

export type Props = {
  open: boolean;
  rhythm: Track;
  setInstrumentPickerOpen: Dispatch<SetStateAction<boolean>>;
};

export function InstrumentPicker(props: Props) {
  const { open, rhythm, setInstrumentPickerOpen } = props;

  const {
    methods: { setTrackVal },
  } = useAudioContext();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { refs, floatingStyles, context } = useFloating({
    placement: 'right-start',
    middleware: [
      flip(),
      offset(10),
      size({
        apply({ rects, elements, availableHeight }) {
          Object.assign(elements.floating.style, {
            maxHeight: `${availableHeight}px`,
            minWidth: `${rects.reference.width + 20}px`,
          });
        },
        padding: 20,
      }),
    ],
    open,
    onOpenChange: setInstrumentPickerOpen,
    whileElementsMounted: autoUpdate,
  });

  const listRef = useRef<Array<HTMLElement | null>>([]);

  const role = useRole(context, { role: 'listbox' });
  const dismiss = useDismiss(context);
  const listNav = useListNavigation(context, {
    listRef,
    activeIndex,
    selectedIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });

  const click = useClick(context, { event: 'mousedown' });
  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [click, role, dismiss, listNav]
  );

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    setInstrumentPickerOpen(false);
    setTrackVal(rhythm, {
      method: 'changeInstrument',
      value: SOUNDS[index] as SoundFile,
    });
  };

  return (
    <div>
      <button
        ref={refs.setReference}
        {...getReferenceProps()}
        style={{ fontSize: '8px' }}
        className={styles['button-instrument']}
      >
        {rhythm.instrument?.sound.name}
      </button>

      {open && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              className={styles.dropdown}
            >
              {SOUNDS.map((s, i) => (
                <div
                  key={s.name}
                  ref={(node) => {
                    listRef.current[i] = node;
                  }}
                  role="option"
                  tabIndex={i === activeIndex ? 0 : -1}
                  aria-selected={i === selectedIndex && i === activeIndex}
                  className={clsx(styles.item, {
                    [styles.active]: i === selectedIndex,
                  })}
                  {...getItemProps({
                    onClick() {
                      handleSelect(i);
                    },
                    onKeyDown(event) {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        handleSelect(i);
                      }
                    },
                  })}
                >
                  {s.name}
                </div>
              ))}
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
