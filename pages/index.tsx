import 'chart.js/auto';
import HotKeys from 'react-hot-keys';
import type { NextPage } from 'next';
import * as React from 'react';
import { Foot } from '../components/Foot/Foot';
import { Modal } from '../components/Modal/Modal';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';
import { AboutModal } from '../components/Modal/AboutModal';

const Home: NextPage = () => {
  const {
    state: { tracks, initialized },
    methods,
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

  const [aboutOpen, setAboutOpen] = React.useState(false);

  const handleKeyDown = React.useCallback(
    (_, ev) => {
      ev.stopPropagation();
      ev.preventDefault();
      methods.save();
    },
    [methods]
  );

  const toggleAbout = React.useCallback(() => {
    setAboutOpen((o) => !o);
  }, []);

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
  }, [measureRect]);

  return (
    <HotKeys keyName="cmd+s" onKeyDown={handleKeyDown} allowRepeat>
      <div className="min-h-screen flex flex-col">
        <Nav toggleAbout={toggleAbout} aboutOpen={aboutOpen} />
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
      {aboutOpen && <AboutModal />}
      {!initialized && <Modal initialize={initialize} />}
    </HotKeys>
  );
};

export default Home;
