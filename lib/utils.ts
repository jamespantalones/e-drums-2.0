import * as Tone from 'tone';
import { Library } from '../types';

export function getRandomLibrary() {
  const arr = [Library.MINIPOPS, Library.TR727, Library.RAVEN];

  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRandomColor() {
  const color = `hsl(${Math.floor(Math.random() * 360)} 80% ${
    Math.floor(Math.random() * 80) + 20
  }%)`;
  return color;
}

function compareArrays(a: number[], b: number[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
export function euclideanRhythm(opts: {
  onNotes: number;
  totalNotes: number;
  pitch?: number;
  previousPattern?: number[];
}): { pattern: number[]; pitchOffset: number[] } {
  const { totalNotes, onNotes } = opts;

  // groups and slots are initially empty arrays.
  // groups will store the final rhythmic pattern and
  // slots will store the 'on' beats from
  // the previous pattern (if one was given)
  let groups: number[][] = [];
  let slots: number[] = [];

  // A loop creates the initial pattern in the groups array.
  // If the current iteration index is less than the maximum
  // number of 'on' beats (stableOnNotes), it adds an array
  // containing 1, else an array containing 0.
  const stableOnNotes = Math.max(onNotes, slots.length);

  for (let i = 0; i < totalNotes; i += 1) {
    groups.push([Number(i < stableOnNotes)]);
  }

  let l: number;

  // The main part of the rhythm generation occurs here.
  // It works by repeatedly splitting the pattern into two halves
  // and merging them together, creating a sort of 'rotational symmetry'.
  // This process continues until no further changes can be made, resulting in
  // the final rhythm.
  while ((l = groups.length - 1)) {
    let start = 0;
    let [first] = groups;

    while (start < l && compareArrays(first, groups[start])) {
      start++;
    }

    if (start === l) break;

    let end = l;
    let last = groups[l];

    while (end > 0 && compareArrays(last, groups[end])) {
      end--;
    }

    if (end === 0) break;

    const count = Math.min(start, l - end);
    groups = groups
      .slice(0, count)
      .map((g, i) => g.concat(groups[l - i]))
      .concat(groups.slice(count, -count));
  }

  const binaryArray = groups.flat().map((a) => {
    if (a === 0) return 0;
    return 1;
  });

  return {
    pattern: binaryArray,
    pitchOffset: binaryArray.map((b) => 0),
  };

  // In the end, the rhythm pattern is converted to a
  // binary array where 'on' beats are replaced by the pitch
  // value (if provided) or 1, and 'off' beats are 0.
  // If there are 'on' beats left in the slots array from a
  // previousPattern, they are used first to populate.
  // return binaryArray.map((a) => {
  //   if (a > 0) {
  //     if (slots.length) {
  //       let val = slots.shift();
  //       if (val) return val;
  //     }
  //     return pitch || 1;
  //   }
  //   return a;
  // });
}

export function createAsyncSampler(file: string): Promise<Tone.Sampler> {
  return new Promise((resolve, reject) => {
    function onLoad() {
      const sampler = new Tone.Sampler({
        C3: buffer,
      });
      return resolve(sampler);
    }

    function onError(err: Error) {
      return reject(err);
    }

    const buffer = new Tone.Buffer(file, onLoad, onError);
  });
}
