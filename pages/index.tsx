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

  return (
    <>
      {!initialized && <Modal initialize={initialize} />}
      <Nav />

      <main>
        <div className="edit__area">
          {tracks.map((rhythm, index) => (
            <TrackItem key={rhythm.id} rhythm={rhythm} index={index} />
          ))}
        </div>
      </main>

      <Foot />
    </>
  );
};

export default Home;
