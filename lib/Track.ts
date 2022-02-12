import * as Tone from "tone";
import { SOUNDS } from "../config/config";
import { generateId } from "../utils";
import { euclideanRhythm } from "./euclideanRhythm";
import { getBeats, loadAudioAsync } from "./utils";

const TOTAL_NOTES_MAX = 256;

export enum Time {
  "HALF_TIME",
  "NORMAL",
  "DOUBLE_TIME",
}



export class Track {
  public onNotes: number;

  public totalNotes: number;

  public note: number;

  public volume: 0.5;

  public id: string;

  public audio!: Tone.Sampler;

  public pattern: number[];

  public time: Time;

  public isReady: boolean;

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
    this.isReady = false;

    this.time = Time.NORMAL;
    this.volume = 0.5;

    this.pattern = euclideanRhythm(this.onNotes, this.totalNotes);
    this.note = note || 400;


    
  }

  public async init(): Promise<Track>{

    const soundFile = `/sounds/minipops/${
      SOUNDS[Math.floor(Math.random() * SOUNDS.length)]
    }`;

    this.audio = await loadAudioAsync(soundFile);

    return this;
  }

  public play(time: number) {
    if (!this.audio){
      throw new Error('Audio file is not initialized. Did you forget to call .init() on the Track?')
    }

    this.audio.triggerAttack(this.note, time);
  
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

    return this;
  }
}
