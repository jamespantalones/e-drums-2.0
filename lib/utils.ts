import { euclideanRhythm } from "./euclideanRhythm";
import { Sequencer } from "./Sequencer";
import { Track } from "./Track";

export const getBeats = (rhythm: Track): number[] => {
  return euclideanRhythm(rhythm.onNotes, rhythm.totalNotes);
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

    if (prop === "tracks") {
    }

    if (prop === "rhythmIndex") {
    }

    return true;
  },
};


