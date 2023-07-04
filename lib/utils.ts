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
}): number[] {
  const { totalNotes, onNotes, pitch, previousPattern } = opts;

  let groups: number[][] = [];
  let slots: number[] = [];

  if (previousPattern) {
    previousPattern.forEach((slot) => {
      if (slot > 0) {
        slots.push(slot);
      }
    });
  }

  let stableOnNotes = Math.max(onNotes, slots.length);

  for (let i = 0; i < totalNotes; i += 1) {
    groups.push([Number(i < stableOnNotes)]);
  }

  let l: number;

  while ((l = groups.length - 1)) {
    let start = 0;
    let [first] = groups;
    while (start < l && compareArrays(first, groups[start])) {
      start++;
    }

    if (start === l) {
      break;
    }

    let end = l;
    let last = groups[l];

    while (end > 0 && compareArrays(last, groups[end])) {
      end--;
    }

    if (end === 0) {
      break;
    }

    const count = Math.min(start, l - end);

    groups = groups
      .slice(0, count)
      .map((g, i) => g.concat(groups[l - i]))
      .concat(groups.slice(count, -count));
  }

  const binaryArray = groups.flat().map((a) => {
    if (a === 0) return 0;
    return pitch || 1;
  });

  // const

  return binaryArray.map((a) => {
    if (a > 0) {
      if (slots.length) {
        let val = slots.shift();
        if (val) {
          return val;
        }
      }
      return pitch || 1;
    }
    return a;
  });
}
