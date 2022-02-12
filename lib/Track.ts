import * as Tone from "tone";
import config, { Library } from "../config/config";
import { generateId } from "../utils";
import { euclideanRhythm } from "./euclideanRhythm";
import { getBeats, loadAudioAsync } from "./utils";


export class Track {
  public onNotes: number;

  public totalNotes: number;

  public library: Library;

  public note: number;

  public volume: 0.5;

  public id: string;

  public audio!: Tone.Sampler;

  public pattern: number[];


  public isReady: boolean;

  public updateSelfInParent: (child: Track) => void;

  constructor({
    onNotes,
    totalNotes,
    note,
    updateSelfInParent,
  }: {
    onNotes: number;
    totalNotes: number;
    note?: number;
    updateSelfInParent: (child: Track) => void;
  }) {
    this.id = generateId();
    this.updateSelfInParent = updateSelfInParent;
    this.onNotes = onNotes;
    this.totalNotes = totalNotes;
    this.isReady = false;
    this.library = Library.SYNSONICS;


    this.volume = 0.5;

    this.pattern = euclideanRhythm(this.onNotes, this.totalNotes);
    this.note = note || 400;


    
  }

  public async init(): Promise<Track>{

    const soundFile = `/sounds/${
      config.SOUNDS[this.library][Math.floor(Math.random() * config.SOUNDS[this.library].length)]
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

  public setRhythmTicks(value: number): Track {
    this.totalNotes = value;
    this.pattern = getBeats(this);
    this.updateSelfInParent(this);
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
