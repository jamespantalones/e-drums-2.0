
import 'chart.js/auto';
import type { NextPage } from 'next';
import * as React from 'react';
import { Chart, Doughnut, } from 'react-chartjs-2';
import { useSequencer } from '../components/hooks/useSequencer';
import { euclideanRhythm } from '../lib/euclideanRhythm';
import { getBeats, Sequencer } from '../lib/Sequencer';

const data = {
  labels: [],
  datasets: [{
    data: [33, 33, 33],
    backgroundColor: [
      // 'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
    ],
    hoverOffset: 2
  }]
};


const Home: NextPage = () => {
  
  const {
    bpm,
    handleBpmChange,
    rhythms,
    play,
    tick,
    decrementBeat,
    incrementBeat,
    decrementTick,
    incrementTick,
    createNewTrack,
    changeFrequency,
  } = useSequencer();


  return (
  <main className="w-full h-screen">
    <button onClick={play} className="button">Play</button>
    <input type="range" min={50} max={240} value={bpm} onChange={handleBpmChange} />
    <p>{bpm}</p>

    {rhythms.map((rhythm, index) => {
      const beats = getBeats(rhythm);

      return (
        <div key={rhythm.id}>
          <div className="w-32 h-32">
            <Doughnut 
            
            key={rhythm.id} width={12} height={12} data={{
              ...data,
              labels: [],
              datasets: [{
                data: new Array(beats.length).fill(100 / beats.length),
                animation: false,
                backgroundColor: new Array(beats.length).fill(0).map((val, i) => {
                  if ((tick % beats.length) === i && !beats[i]){
                    return 'yellow';
                  }

                  if ((tick % beats.length) === i && beats[i]){
                    return 'red';
                  }
                  if (beats[i]){
                    return 'black';
                  }
                  return 'gray';
                }),
    
              }]
            }}/>
          </div>
          <div className="my-2 mx-auto text-center">
            <label>Ticks</label>
            <button className="button x-auto" onClick={decrementTick(rhythm)}>-</button>
            <button className="button mx-auto" onClick={incrementTick(rhythm)}>+</button>
          </div>
          <div className="my-2 mx-auto text-center">
            <label>Beats</label>
            <button className="button x-auto" onClick={decrementBeat(rhythm)}>-</button>
            <button className="button mx-auto" onClick={incrementBeat(rhythm)}>+</button>
          </div>
          <div>
            <input type="range" min={20} max={1000} onChange={changeFrequency(rhythm)}/>
          </div>
        </div>
      )
    })}

    <button className="button" onClick={createNewTrack}>New Track</button>

  </main>
  );
}

export default Home
