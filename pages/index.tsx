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
      <Nav toggleAbout={toggleAbout} aboutOpen={aboutOpen} />

      <main ref={ref} className="pb-16">
        {tracks.map((rhythm, index) => (
          <TrackItem key={rhythm.id} rhythm={rhythm} index={index} />
        ))}
      </main>
      <Foot />
      {aboutOpen && <AboutModal />}
      {!initialized && <Modal initialize={initialize} />}
    </>
  );
};

export default Home;
