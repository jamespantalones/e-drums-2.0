import * as Tone from 'tone';
import { SOUNDS } from '../config';
import { Instrument, SoundFile, TrackOpts } from '../types';
import { generateId } from '../utils';
import {
  createAsyncSampler,
  euclideanRhythm,
  generateRandomColor,
} from './utils';

export class Track {
  public color: string;
  public onNotes: number;

  public totalNotes: number;

  public pitch: number;

  public volume: number;

  public id: string;

  public index: number;

  public sampler!: Tone.Sampler;

  public pattern: number[];
  public pitchOffset: number[];

  public isReady: boolean;

  public fileBuffer: null | string;

  public instrument: Instrument | null;

  public updateSelfInParent: (
    child: Track,
    { needsReconnect }: { needsReconnect?: true }
  ) => void;

  constructor(opts: TrackOpts) {
    this.id = opts.id || generateId();
    this.index = opts.index;
    this.updateSelfInParent = opts.updateSelfInParent;
    this.onNotes = opts.onNotes || 4;
    this.totalNotes = opts.totalNotes || 8;
    this.isReady = false;
    this.instrument = opts.instrument || null;
    this.fileBuffer = null;
    this.color = opts.color || generateRandomColor();
    this.volume = 0.3;
    this.pitch = 50;

    const { pattern, pitchOffset } = euclideanRhythm({
      onNotes: this.onNotes,
      totalNotes: this.totalNotes,
      pitch: this.pitch,
    });
    this.pattern = pattern;
    this.pitchOffset = pitchOffset;
  }

  public async init(): Promise<Track> {
    if (this.instrument) {
      this.sampler = await createAsyncSampler(
        `/sounds/${this.instrument.sound.files[0]}`
      );
    } else {
      this.sampler = await createAsyncSampler(
        `/sounds/${this._createSoundFile().sound.files[0]}`
      );
    }
    this.isReady = true;

    return this;
  }

  private _createSoundFile(value?: SoundFile): Instrument {
    // placeholder for final sound
    let sound = value || SOUNDS[Math.floor(Math.random() * SOUNDS.length)];

    this.instrument = {
      sound: sound as SoundFile,
      frequency: this.pitch,
    };

    return this.instrument;
  }

  public play(time: number, tick: number) {
    if (!this.sampler || !this.isReady) {
      console.warn('Audio file not yet ready...');
      return;
    }

    const freq = Tone.Frequency(
      // use user specified pitch, falling back
      // to initial pitch
      // calc offset here
      this.pitch + (this.pitchOffset[tick] || 0),
      'midi'
    ).toFrequency();

    this.sampler.triggerAttack(freq, time, this.volume);
  }

  public setRhythmTicks(value: number): Track {
    this.totalNotes = value;
    const length = this.pattern.length;

    if (value === length) {
      this.updateSelfInParent(this, {});
      return this;
    }

    if (value > length) {
      this.pattern.push(0);
      this.pitchOffset.push(0);
      this.updateSelfInParent(this, {});
      return this;
    }

    this.pattern.pop();
    this.pitchOffset.pop();
    this.updateSelfInParent(this, {});
    return this;
  }

  public async changeInstrument(value?: SoundFile): Promise<Track> {
    // get the selected instrument from the sound files
    this.isReady = false;
    const file = `/sounds/${this._createSoundFile(value).sound.files[0]}`;

    // dispose of old audio file
    if (this.sampler) {
      this.sampler.dispose();
    }

    // load the new one
    this.sampler = await createAsyncSampler(file);
    this.isReady = true;

    // update the parent
    this.updateSelfInParent(this, { needsReconnect: true });
    return this;
  }
  public changePitch(value: number): Track {
    this.pitch = value;
    return this;
  }

  public changeVolume(value: number): Track {
    this.volume = value;
    return this;
  }

  public toggleNote(index: number): Track {
    this.pattern = this.pattern.map((p, i) => {
      if (i === index) return 1 - p;
      return p;
    });

    return this;
  }

  public noteOff(): Track {
    this.pitchOffset = this.pitchOffset.map(() => 0);

    this.pattern = this.pattern.map(() => 0);

    return this;
  }

  public repitchNote(index: number, type: 'INCREMENT' | 'DECREMENT'): Track {
    // loop through
    this.pitchOffset = this.pitchOffset.map((p, i) => {
      if (index !== i) return p;
      return p + (type === 'INCREMENT' ? 1 : -1);
    });

    return this;
  }
}
