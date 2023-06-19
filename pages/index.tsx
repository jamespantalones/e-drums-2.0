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

  const [aboutOpen, setAboutOpen] = React.useState(false);

  const toggleAbout = React.useCallback(() => {
    setAboutOpen((o) => !o);
  }, []);

  return (
    <>
      <div className="min-h-[100vh] flex flex-col">
        <Nav toggleAbout={toggleAbout} aboutOpen={aboutOpen} />
        <main className="w-full flex-grow py-0" ref={ref}>
          <section className="mt-16 pb-16 w-full">
            {tracks.map((rhythm, index) => (
              <TrackItem key={rhythm.id} rhythm={rhythm} index={index} />
            ))}
          </section>
        </main>
        <Foot />
      </div>
      {aboutOpen && <AboutModal />}
      {!initialized && <Modal initialize={initialize} />}
    </>
  );
};

export default Home;
