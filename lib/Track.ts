import * as Tone from "tone";
import { generateId } from "../utils";
import { euclideanRhythm } from "./euclideanRhythm";
import { getBeats } from "./utils";

const TOTAL_NOTES_MAX = 256;

export enum Time {
  "HALF_TIME",
  "NORMAL",
  "DOUBLE_TIME",
}

export const SOUNDS = [
  "pops-bd-1.wav",
  "pops-bd-2.wav",
  "pops-bd-3.wav",
  "pops-bd-4.wav",
  "pops-clave1.wav",
  "pops-clave2.wav",
  "pops-clave5.wav",
  "pops-clave6.wav",
  "pops-con1.wav",
  "pops-con2.wav",
  "pops-con3.wav",
  "pops-con4.wav",
  "pops-hh-1.wav",
  "pops-hh-2.wav",
  "pops-hh-3.wav",
  "pops-hh-4.wav",
  "pops-hh-5.wav",
  "pops-hh-6.wav",
  "pops-hh-hho1.wav",
  "pops-hh-hho2.wav",
  "pops-mix-1.wav",
  "pops-mix-2.wav",
  "pops-rim1.wav",
  "pops-rim2.wav",
  "pops-rim3.wav",
  "pops-rim4.wav",
  "pops-sd-1.wav",
  "pops-sd-2.wav",
  "pops-sd-3.wav",
  "pops-sd-4.wav",
  "pops-sd-5.wav",
];

export class Track {
  public onNotes: number;

  public totalNotes: number;

  public note: number;

  public volume: 0.5;

  public id: string;

  public audio: Tone.Sampler;

  public pattern: number[];

  public time: Time;

  constructor({
    onNotes,
    totalNotes,
    note,
  }: {
    onNotes: number;
    totalNotes: number;
    note?: number;
  }) {
    this.id = generateId();
    this.onNotes = onNotes;
    this.totalNotes = totalNotes;

    this.time = Time.NORMAL;
    this.volume = 0.5;

    this.pattern = euclideanRhythm(this.onNotes, this.totalNotes);
    this.note = note || 400;

    this.audio = new Tone.Sampler({
      //C3: "/sounds/minipops/pops-clave1.wav",
      C3: `/sounds/minipops/${
        SOUNDS[Math.floor(Math.random() * SOUNDS.length)]
      }`,
    });
  }

  public play(time: number) {
    if (this.audio) {
      try {
        this.audio.triggerAttack(this.note, time);
      } catch (err) {
        console.error(err);
      }
    }
  }

  public adjustTimeScale(time: Time) {
    this.time = time;
    return this;
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
    this.pattern = this.pattern.map((p, i) => {
      if (i === index) {
        return 1 - p;
      }
      return p;
    });

    console.log("this pattern", this.pattern);
    return this;
  }
}
