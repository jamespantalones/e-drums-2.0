import 'chart.js/auto';
import type { NextPage } from 'next';
import * as React from 'react';
import { Foot } from '../components/Foot/Foot';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';

const Home: NextPage = () => {
  const {
    state: { tracks },
  } = useAudioContext();

  return (
    <>
      <Nav />
      <main className="w-full h-screen gridpaper">
        <section className="h-full w-full flex overflow-x-auto">
          {tracks.map((rhythm) => (
            <TrackItem key={rhythm.id} rhythm={rhythm} />
          ))}
        </section>
      </main>
      <Foot />
    </>
  );
};

export default Home;
