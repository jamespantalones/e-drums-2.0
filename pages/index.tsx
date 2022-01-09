import type { NextPage } from 'next';
import * as React from 'react';
import { euclideanRhythm } from '../lib/euclideanRhythm';
import { Sequencer } from '../lib/Sequencer';


const Home: NextPage = () => {
  const [bpm, setBpm] = React.useState(120);
  const ctx = React.useRef<Sequencer | null>(new Sequencer({}));

  const play = React.useCallback(async () => {
    if (!ctx.current){
      return;
    }
    await ctx.current.start();
  },[]);

  const handleBpmChange = React.useCallback((ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(ev.target.value, 10);
    setBpm(val);
    if (ctx.current){
      ctx.current.setBpm(val);
    }
  },[]);



  return (
  <main className="w-full h-screen">
    <button onClick={play} className="button">Play</button>
    <input type="range" min={50} max={240} value={bpm} onChange={handleBpmChange} />
    <p>{bpm}</p>
  </main>
  );
}

export default Home
