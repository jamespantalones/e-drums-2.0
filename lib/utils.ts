import { euclideanRhythm } from './euclideanRhythm';
import { Sequencer } from './Sequencer';
import { Track } from './Track';

export const getBeats = (
  rhythm: Track,
  pitch: number,
  pattern?: number[]
): number[] => {
  return euclideanRhythm({
    onNotes: rhythm.onNotes,
    totalNotes: rhythm.totalNotes,
    pitch,
    previousPattern: pattern,
  });
};

export const handler: ProxyHandler<{
  _instance: Sequencer;
  rhythmIndex: number;
  tracks: Track[];
}> = {
  set(obj, prop, value) {
    // The default behavior to store the value
    // @ts-ignore
    obj[prop as string] = value;

    if (prop === 'tracks') {
    }

    if (prop === 'rhythmIndex') {
    }

    return true;
  },
};

export function generateRandomColor() {
  const color = `hsl(${Math.floor(Math.random() * 360)} 80% ${
    Math.floor(Math.random() * 80) + 20
  }%)`;
  return color;
}
