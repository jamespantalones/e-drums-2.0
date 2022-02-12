import 'chart.js/auto';
import type { NextPage } from 'next';
import * as React from 'react';
import { useSequencer } from '../components/hooks/useSequencer';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';

const Home: NextPage = () => {
  const { tracks } = useSequencer();

  return (
    <>
      <Nav />
      <main className="w-full h-screen">
        <section className="flex flex-wrap items-start justify-start">
          {tracks.map((rhythm) => (
            <TrackItem key={rhythm.id} rhythm={rhythm} />
          ))}
        </section>
      </main>
    </>
  );
};

export default Home;
