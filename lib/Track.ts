import * as Tone from "tone";
import { generateId } from "../utils";
import { euclideanRhythm } from "./euclideanRhythm";
import { getBeats } from "./utils";

const TOTAL_NOTES_MAX = 256;

// export class SamplerAsync extends Tone.Sampler {
//   constructor(notes: { [key: string]: any }) {
//     super(notes);
//   }

//   async init(){

//   }
// }

export class Track {
  public onNotes: number;

  public totalNotes: number;

  public note: number;

  public id: string;

  public audio: Tone.Sampler;

  public pattern: number[];
  constructor({
    onNotes,
    totalNotes,
  }: {
    onNotes: number;
    totalNotes: number;
  }) {
    this.id = generateId();
    this.onNotes = onNotes;
    this.totalNotes = totalNotes;

    this.pattern = euclideanRhythm(this.onNotes, this.totalNotes);
    this.note = 400;

    this.audio = new Tone.Sampler({
      C3: "/sounds/minipops/pops-clave1.wav",
    });

    this.audio;
  }

  public play(time: number) {
    if (this.audio) {
      this.audio.triggerAttack(this.note, time);
    }
  }

  public incrementBeat(): Track {
    if (this.onNotes + 1 <= this.totalNotes) {
      this.onNotes += 1;
    }
    return this;
  }

  public decrementBeat(): Track {
    if (this.onNotes - 1 >= 0) {
      this.onNotes -= 1;
    }

    return this;
  }

  public incrementTick(): Track {
    if (this.totalNotes + 1 <= TOTAL_NOTES_MAX) {
      this.totalNotes += 1;
    }

    this.pattern = getBeats(this);

    console.log("pattern", this.pattern);

    return this;
  }

  public decrementTick(): Track {
    if (this.totalNotes - 1 >= 0) {
      this.totalNotes -= 1;
    }
    this.pattern = getBeats(this);
    return this;
  }

  public changeFrequency(value: number): Track {
    this.note = value;
    return this;
  }

  public toggleNote(index: number, instance: Track): Track {
    // if we already have a pattern
    if (this.pattern) {
      console.log("uuu");
      this.pattern = this.pattern.map((p, i) => {
        if (i === index) {
          return 1 - p;
        }
        return p;
      });
    }

    this.pattern = getBeats(instance).map((p, i) => {
      if (i === index) {
        return 1 - p;
      }
      return p;
    });

    return this;
  }
}
