import * as Tone from 'tone';
import config from '../config/config';
import {
  Config,
  CurrentInstrument,
  Library,
  SoundFile,
  TrackOpts,
} from '../types';
import { generateId } from '../utils';
import { euclideanRhythm } from './euclideanRhythm';
import { getBeats } from './utils';

const VOLUME_MULTIPLIER = 1.25;

export function getRandomLibrary() {
  const arr = [Library.MINIPOPS, Library.TR727];

  return arr[Math.floor(Math.random() * arr.length)];
}

export class Track {
  public color: string;
  public onNotes: number;

  public totalNotes: number;

  public library: Library;

  public pitch: number;

  public volume: number;

  public id: string;

  public index: number;

  public audio!: Tone.Sampler;

  public soundOptions!: Config['SOUNDS'][Library];

  public pattern: number[];

  public isReady: boolean;

  public primaryFile: null | string;

  public currentInstrument: CurrentInstrument | null;

  public updateSelfInParent: (
    child: Track,
    { needsReconnect }: { needsReconnect?: true }
  ) => void;

  constructor(opts: TrackOpts) {
    this.id = opts.id || generateId();
    this.index = opts.index;
    this.updateSelfInParent = opts.updateSelfInParent;
    this.onNotes = opts.onNotes;
    this.totalNotes = opts.totalNotes;
    this.isReady = false;
    this.library = opts.library || getRandomLibrary();
    this.currentInstrument = opts.currentInstrument || null;
    this.primaryFile = null;
    this.color = opts.color;

    this.volume = 0.6;
    // get all sounds from the library
    this.soundOptions = config.SOUNDS[this.library];
    this.pattern = euclideanRhythm(this.onNotes, this.totalNotes);
    this.pitch = opts.pitch || Math.floor(Math.random() * 127);
  }

  static loadAudioAsync(file: string): Promise<Tone.Sampler> {
    return new Promise((resolve, reject) => {
      let audio: Tone.Sampler;

      function onLoad() {
        resolve(audio);
      }

      const buffer = new Tone.Buffer(file, () => {
        audio = new Tone.Sampler({
          C3: buffer,
        });
        onLoad();
      });
    });
  }

  public changeLibrary(library: Library) {
    this.library = library;
    this.soundOptions = config.SOUNDS[this.library];
    return this;
  }

  public async init(): Promise<Track> {
    if (this.currentInstrument) {
      this.audio = await Track.loadAudioAsync(
        `/sounds/${this.currentInstrument.file}`
      );
    } else {
      this.audio = await Track.loadAudioAsync(
        `/sounds/${this._createSoundFile().file}`
      );
    }
    this.isReady = true;

    return this;
  }

  private _createSoundFile(value?: SoundFile): CurrentInstrument {
    // placeholder for final sound
    let primarySound: SoundFile;

    // there is is not already a value
    if (!value) {
      const primarySoundFile =
        this.soundOptions[this.index % this.soundOptions.length];
      primarySound = primarySoundFile;
    } else {
      primarySound = value;
    }

    const [min = 40, max = 100] = primarySound.defaultFreqRange;

    this.currentInstrument = {
      parent: primarySound,
      file: primarySound.files[
        Math.floor(Math.random() * primarySound.files.length)
      ],
      frequency: Math.floor(Math.random() * max) + min,
    };

    this.pitch = this.currentInstrument.frequency;

    return this.currentInstrument;
  }

  public play(time: number) {
    if (!this.audio || !this.isReady) {
      console.warn('Audio file not yet ready...');
      return;
    }

    const freq = Tone.Frequency(this.pitch, 'midi').toFrequency();
    this.audio.triggerAttack(freq, time, this.volume * VOLUME_MULTIPLIER);
  }

  public setRhythmTicks(value: number): Track {
    this.totalNotes = value;
    this.pattern = getBeats(this);
    this.updateSelfInParent(this, {});
    return this;
  }

  public async changeInstrument(value: SoundFile): Promise<Track> {
    // get the selected instrument from the sound files
    this.isReady = false;
    const file = `/sounds/${this._createSoundFile(value).file}`;

    // dispose of old audio file
    if (this.audio) {
      this.audio.dispose();
    }

    // load the new one
    this.audio = await Track.loadAudioAsync(file);
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
