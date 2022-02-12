import * as Tone from "tone";
import { euclideanRhythm } from "./euclideanRhythm";
import { pubsub } from "./pubsub";
import { SequencerEvents } from "./schema";
import { Sequencer } from "./Sequencer";
import { Track } from "./Track";

export const getBeats = (rhythm: Track): number[] => {
  // if (rhythm.pattern) {
  //   return rhythm.pattern;
  // }
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
      pubsub.emit<SequencerEvents>(SequencerEvents.RHYTHM_CHANGE, value);
    }

    if (prop === "rhythmIndex") {
      pubsub.emit<SequencerEvents>(SequencerEvents.TICK, value);
    }

    return true;
  },
};


export async function loadAudioAsync(file: string): Promise<Tone.Sampler>{
  return new Promise((resolve, reject) => {

    let audio: Tone.Sampler;

    function onLoad(){
      resolve(audio);
    }

    audio = new Tone.Sampler({
      C3: file,
    }, onLoad)
  });
}