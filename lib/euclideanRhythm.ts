import { group } from "console";

function compareArrays(a: any[], b: any[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
export function euclideanRhythm(onNotes: number, totalNotes: number): any[] {
  let groups = [] as any[];

  for (let i = 0; i < totalNotes; i += 1) {
    groups.push([Number(i < onNotes)]);
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

    let count = Math.min(start, l - end);

    groups = groups
      .slice(0, count)
      .map((g, i) => {
        return g.concat(groups[l - i]);
      })
      .concat(groups.slice(count, -count));
  }

  return [].concat.apply([], groups);
}
