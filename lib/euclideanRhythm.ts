function compareArrays(a: any[], b: any[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
export function euclideanRhythm(
  onNotes: number,
  totalNotes: number,
  pitch: number
): number[] {
  let groups: number[][] = [];

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

    const count = Math.min(start, l - end);

    groups = groups
      .slice(0, count)
      .map((g, i) => g.concat(groups[l - i]))
      .concat(groups.slice(count, -count));
  }

  const arr = groups.flat();
  return arr.map((a) => {
    if (a === 0) {
      return 0;
    }
    return pitch;
  });
}
