import * as Tone from 'tone';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import config from '../config/config';
import { SequencerPlayState, SerializedTrack } from '../types';
import { generateId, getRandomValue } from '../utils';
import { Track } from './Track';

export interface SequencerOpts {
  initialTracks?: SerializedTrack[];

  bpm: number;

  onTick: (tickVal: number) => void;
}

// ------------------------------------------------------------
// Sequencer Class
// ------------------------------------------------------------
export class Sequencer {
  public state: {
    rhythmIndex: number;
    tracks: Track[];
  };

  public bpm: number;

  public onTick: (tick: number) => void;

  public isInit: boolean;

  private reverb!: Tone.Reverb;
  private chain!: Tone.Gain;

  private transport!: Transport;

  playState: SequencerPlayState;

  constructor({ bpm, onTick, initialTracks = [] }: SequencerOpts) {
    this.isInit = false;
    this.bpm = bpm;
    this.onTick = onTick;

    this.state = {
      rhythmIndex: -1,
      tracks: initialTracks.map(
        (track) =>
          new Track({
            ...track,
            updateSelfInParent: this.updateChild,
          })
      ),
    };

    this.playState = SequencerPlayState.STOPPED;
  }

  async init() {
    try {
      // start the AudioContext engine (on user interactive only)
      await Tone.start();

      // TODO: move this out
      // create an audio chain
      this.reverb = new Tone.Reverb();
      this.reverb.wet.value = 0.05;

      this.chain = new Tone.Gain();
      this.chain.chain(this.reverb, Tone.Destination);

      // load all initial tracks
      const trackPromises = this.state.tracks.map((t) => t.init());
      const resolvedTracks = await Promise.all(trackPromises);

      // loop through each resolved track and connect to chain
      resolvedTracks.forEach((track) => track.audio.connect(this.chain));
      this.state.tracks = resolvedTracks;

      this.isInit = true;

      // for each track, create it

      return this;
    } catch (err) {
      console.error('B', err);
      throw err;
    }
  }

  static generateTrack(index: number): SerializedTrack {
    const random = Math.floor(Math.random() * 20) + 3;
    return {
      id: generateId(),
      index,
      onNotes: Math.floor(random / 2),
      totalNotes: random,
      pitch: Math.floor(Math.random() * 127),
      color: config.COLORS[Math.floor(Math.random() * config.COLORS.length)],
    };
  }

  // stop the transport
  stop() {
    if (this.transport) {
      this.transport.pause();
    }
  }

  private _setupTransport() {
    this.transport = Tone.Transport;
    // on every 16th note...
    this.transport.scheduleRepeat((time) => {
      // IMPORTANT: any UI updates need to be called
      // here to not block main thread
      Tone.Draw.schedule(() => {
        // increment rhythm index
        this.state.rhythmIndex = this.state.rhythmIndex + 1;

        // call the current tick increment
        this.onTick(this.state.rhythmIndex);
      }, time);

      // increment rhythm index
      let nextIndex = this.state.rhythmIndex + 1;

      this.state.tracks.forEach((track) => {
        const currentTick = nextIndex % track.pattern.length;
        if (track.pattern[currentTick]) {
          // normal time
          track.play(time);
        }
      });
      // use the callback time to schedule events
    }, '16n');

    Tone.Transport.bpm.value = this.bpm;
    Tone.Transport.swing = 0.05;
  }

  async start() {
    if (!this.isInit) {
      await this.init();
    }

    // if transport hasn't been set up.. set it up
    if (!this.transport) {
      this._setupTransport();
    }

    Tone.Transport.start();
  }

  public async addNewRhythm(rhythm: SerializedTrack): Promise<Track> {
    if (!this.isInit) {
      await this.init();
    }

    const nextTrack = new Track({
      index: rhythm.index,
      onNotes: rhythm.onNotes,
      color: getRandomValue<string>(config.COLORS),
      totalNotes: rhythm.totalNotes,
      pitch: rhythm.pitch,
      // pass a function that allows the child to
      // tell it's parent when to update itself
      updateSelfInParent: this.updateChild,
    });

    await nextTrack.init();

    nextTrack.audio.connect(this.chain);

    // add
    this.state.tracks = this.state.tracks.concat(nextTrack);

    return nextTrack;
  }

  public toggleTick(id: string, index: number): [Track | undefined, Track[]] {
    let rhythmTarget: Track | undefined = undefined;

    this.state.tracks = this.state.tracks.map((rhythm) => {
      // if we have a target
      if (rhythm.id === id) {
        const track = rhythm.toggleNote(index, rhythm);
        rhythmTarget = track;
        return track;
      }

      return rhythm;
    });

    return [rhythmTarget, this.state.tracks];
  }

  public setBpm(val: number) {
    Tone.Transport.bpm.value = val;
  }

  updateChild = (
    child: Track,
    { needsReconnect }: { needsReconnect?: boolean }
  ) => {
    this.state.tracks = this.state.tracks.map((track) => {
      if (track.id === child.id) {
        if (needsReconnect) {
          child.audio.connect(this.chain);
        }
        return child;
      }
      return track;
    });
  };

  public deleteTrack(id: string): [string, Track[]] {
    this.state.tracks = this.state.tracks.filter((r) => r.id !== id);
    return [id, this.state.tracks];
  }
}
