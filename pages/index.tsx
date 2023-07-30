import type { NextPage } from 'next';
import * as React from 'react';
import { Splash } from '../components/Splash/Splash';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';
import Link from 'next/link';

const Home: NextPage = () => {
  const {
    state: { tracks, initialized },
    initialize,
  } = useAudioContext();

  if (!initialized) {
    return <Splash initialize={initialize} />;
  }

  return (
    <section className="p-4">
      <p>
        This page not done AT ALL. This is where your saved tracks will appear.
      </p>
      <p className="my-4">Save not implemented yet!</p>
      <p>Need to implement cool Colombian colors</p>
      <div className="my-4 border p-2 border-neutral-700 rounded inline-block">
        <Link href="/foo">+ Create</Link>
      </div>
    </section>
  );
};

export default Home;
