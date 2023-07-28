import type { NextPage } from 'next';
import * as React from 'react';
import { Splash } from '../components/Splash/Splash';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';

const Home: NextPage = () => {
  const {
    state: { tracks, initialized },
    initialize,
  } = useAudioContext();

  if (!initialized) {
    return <Splash initialize={initialize} />;
  }

  return (
    <>
      <Nav />
      <main>
        <div className="edit__area">
          {tracks.map((rhythm, index) => (
            <TrackItem key={rhythm.id} rhythm={rhythm} index={index} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
