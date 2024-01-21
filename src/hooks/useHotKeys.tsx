import { useCallback, useEffect, useRef } from 'react';

export type Handlers = {
  [key: string]: () => void;
};

export function useHotKeys(handlers: Handlers) {
  let metaDown = useRef(false);

  const handleKeyDown = useCallback(
    (ev: KeyboardEvent) => {
      if (ev.metaKey) {
        metaDown.current = true;
      } else {
        metaDown.current = false;
      }

      for (let k in handlers) {
        if (ev.key === k && metaDown) {
          ev.preventDefault();
          handlers[k]();
        }
      }
    },
    [handlers]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handlers, handleKeyDown]);
}
