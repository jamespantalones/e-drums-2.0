import 'chart.js/auto';
import type { NextPage } from 'next';
import * as React from 'react';
import { Foot } from '../components/Foot/Foot';
import { Modal } from '../components/Modal/Modal';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';

const Home: NextPage = () => {
  const {
    state: { tracks, initialized },
    initialize,
  } = useAudioContext();

  const ref = React.useRef<HTMLElement | null>(null);
  const [rect, setRect] = React.useState<Omit<DOMRect, 'toJSON'>>({
    top: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  const measureRect = React.useCallback(() => {
    if (!ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    setRect(rect);
  }, []);

  React.useEffect(() => {
    measureRect();

    window.addEventListener('resize', measureRect, { passive: true });

    return () => {
      window.removeEventListener('resize', measureRect);
    };
  }, []);

  return (
    <>
      <div className="h-screen flex flex-col">
        <Nav />
        <main className="w-full gridpaper flex-grow py-0" ref={ref}>
          <section className="h-full w-full overflow-x-auto">
            {tracks.map((rhythm, index) => (
              <TrackItem
                key={rhythm.id}
                rhythm={rhythm}
                rect={rect}
                index={index}
              />
            ))}
          </section>
        </main>
        <Foot />
      </div>
      {!initialized && <Modal initialize={initialize} />}
    </>
  );
};

export default Home;
