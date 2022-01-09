import type { NextPage } from 'next';
import * as React from 'react';
import { euclideanRhythm } from '../lib/euclideanRhythm';
import { Sequencer } from '../lib/Sequencer';


const Home: NextPage = () => {
  const ctx = React.useRef<Sequencer | null>(new Sequencer({}));

  const play = React.useCallback(async () => {
    if (!ctx.current){
      return;
    }
    await ctx.current.start();
  },[]);



  return (
  <main className="w-full h-screen">
    <button onClick={play} className="button">Play</button>
  </main>
  );
}

export default Home
