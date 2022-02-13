import * as Tone from "tone";
import config, { Config, Library, SoundFile } from "../config/config";
import { generateId } from "../utils";
import { euclideanRhythm } from "./euclideanRhythm";
import { getBeats, loadAudioAsync } from "./utils";

export type CurrentInstrument = {
  parent: SoundFile,
  file: string;
  frequency: number;
};


export class Track {
  public onNotes: number;

  public totalNotes: number;

  public library: Library;

  public pitch: number;

  public volume: 0.5;

  public id: string;

  public audio!: Tone.Sampler;

  public soundOptions!: Config['SOUNDS'][Library]

  public pattern: number[];


  public isReady: boolean;

  public primaryFile: null | string;

  public currentInstrument: CurrentInstrument | null;

  public updateSelfInParent: (child: Track, {needsReconnect}: {needsReconnect?: true}) => void;

  constructor({
    onNotes,
    totalNotes,
    pitch,
    updateSelfInParent,
  }: {
    onNotes: number;
    totalNotes: number;
    pitch?: number;
    updateSelfInParent: (child: Track, {needsReconnect}: {needsReconnect?: boolean}) => void;
  }) {
    this.id = generateId();
    this.updateSelfInParent = updateSelfInParent;
    this.onNotes = onNotes;
    this.totalNotes = totalNotes;
    this.isReady = false;
    this.library = Library.MINIPOPS;
    this.currentInstrument = null;
    this.primaryFile = null;

    this.volume = 0.5;

    this.pattern = euclideanRhythm(this.onNotes, this.totalNotes);
    this.pitch = pitch || Math.floor(Math.random() * 127);
  }

  public async init(): Promise<Track>{

    this.audio = await loadAudioAsync(`/sounds/${this._createSoundFile().file}`);
    this.isReady = true;

    return this;
  }

  private _createSoundFile(value?: SoundFile): CurrentInstrument{
    // get all sounds from the library
    this.soundOptions = config.SOUNDS[this.library];
    let primarySound: SoundFile;

    if (!value){
      const [primarySoundFile] = this.soundOptions;
      primarySound = primarySoundFile;
    } else {
      primarySound = value;
    }

    const [min = 20, max = 100] = primarySound.defaultFreqRange;

    console.log('MINMAX', min, max);


    this.currentInstrument = {
      parent: primarySound,
      file: primarySound.files[Math.floor(Math.random() * primarySound.files.length)],
      frequency: Math.floor(Math.random() * max) + min,
    };

    this.pitch = this.currentInstrument.frequency;


    return this.currentInstrument;
  }

  public play(time: number) {
    if (!this.audio || !this.isReady){
      console.warn('Audio file not yet ready...');
      return;
    }
    

    const freq = Tone.Frequency(this.pitch, 'midi').toFrequency();
    this.audio.triggerAttack(freq, time + 0.25, this.volume);

  
  }


  public setRhythmTicks(value: number): Track {
    this.totalNotes = value;
    this.pattern = getBeats(this);
    this.updateSelfInParent(this, {});
    return this;
  }



  public async changeInstrument(value: SoundFile): Promise<Track>{
    // get the selected instrument from the sound files
    this.isReady = false;
    const file = `/sounds/${this._createSoundFile(value).file}`;
    
    // dispose of old audio file
    if (this.audio){
      this.audio.dispose();
    }


    // load the new one
    this.audio = await loadAudioAsync(file);
    this.isReady = true;

    // update the parent
    this.updateSelfInParent(this, {needsReconnect: true});
    return this;
  }
  public changePitch(value: number): Track {
    this.pitch = value;
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
