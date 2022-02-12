import 'chart.js/auto';
import type { NextPage } from 'next';
import * as React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { useSequencer } from '../components/hooks/useSequencer';
import { Nav } from '../components/Nav/Nav';
import { useAudioContext } from '../contexts/AudioContext';
import { Time, Track } from '../lib/Track';

const data = {
  labels: [],
  datasets: [
    {
      data: [33, 33, 33],
      backgroundColor: [
        // 'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
      ],
      hoverOffset: 2,
    },
  ],
};

const Home: NextPage = () => {
  const { initialize } = useAudioContext();
  const {
    adjustTimeScale,
    bpm,
    handleBpmChange,
    tracks,
    play,
    tick,
    decrementTick,
    incrementTick,
    createNewTrack,
    changeFrequency,
    deleteTrack,
    toggleTick,
    isInit,
  } = useSequencer();

  const handleClick = React.useCallback((rhythm: Track) => {
    return function onClick(ev: any, items: any) {
      const [item] = items;
      toggleTick(rhythm.id, item.index);
      console.log(item);
    };
  }, []);

  return (
    <>
      <Nav />
      <main className="w-full h-screen">
        <section className="flex flex-wrap items-start justify-start">
          {tracks.map((rhythm, index) => {
            const length = rhythm.pattern.length;

            return (
              <div key={rhythm.id} className="w-1/3 p-2 flex-grow-0">
                <div className="border-2 border-white p-2">
                  <div className="w-64 h-64 cursor-pointer">
                    <Doughnut
                      key={rhythm.id}
                      width={12}
                      height={12}
                      data={{
                        ...data,
                        labels: [],

                        datasets: [
                          {
                            data: new Array(length).fill(100 / length),
                            animation: false,
                            borderColor: 'black',
                            borderWidth: 1,
                            parsing: false,
                            offset: 0,
                            backgroundColor: new Array(length)
                              .fill(0)
                              .map((val, i) => {
                                if (tick % length === i && !rhythm.pattern[i]) {
                                  return 'rgb(255,150,150)';
                                }

                                if (tick % length === i && rhythm.pattern[i]) {
                                  return 'var(--color-secondary)';
                                  return 'var(--color-tick-active-on)';
                                }
                                if (rhythm.pattern[i]) {
                                  return 'rgb(255,50,150)';
                                }
                                return 'rgb(251,207,232)';
                              }),
                          },
                        ],
                      }}
                      options={{
                        cutout: '70%',
                        radius: 100,
                        events: ['click'],
                        onClick: handleClick(rhythm),
                        animation: {
                          animateRotate: false,
                        },

                        plugins: {
                          tooltip: {
                            enabled: false,
                            mode: 'nearest',
                          },
                        },
                        hover: {
                          mode: undefined,
                        },
                      }}
                    />
                  </div>
                  <div className="my-2 mx-auto text-center">
                    <label>Ticks</label>
                    <button
                      className="button x-auto"
                      onClick={decrementTick(rhythm)}
                    >
                      -
                    </button>
                    <button
                      className="button mx-auto"
                      onClick={incrementTick(rhythm)}
                    >
                      +
                    </button>
                  </div>
                  <div className="my-2 mx-auto text-center">
                    <label>Time</label>
                  </div>
                  <div>
                    <input
                      type="range"
                      min={0}
                      max={500}
                      defaultValue={rhythm.note}
                      onChange={changeFrequency(rhythm)}
                    />
                  </div>
                  <div>
                    <button onClick={deleteTrack(rhythm)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <button className="button" onClick={createNewTrack}>
          New Track
        </button>
      </main>
    </>
  );
};

export default Home;
