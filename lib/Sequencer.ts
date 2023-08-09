import * as Tone from 'tone';
import { Transport } from 'tone/build/esm/core/clock/Transport';
import {
  SequencerPlayState,
  SerializedSequencer,
  SerializedTrack,
} from '../types';
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
      Tone.start();

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
      resolvedTracks.forEach((track) => {
        if (track.isReady) {
          track.sampler.connect(this.chain);
        }
      });
      this.state.tracks = resolvedTracks;

      this.isInit = true;

      // for each track, create it

      return this;
    } catch (err) {
      console.error('B', err);
      throw err;
    }
  }

  // stop the transport
  stop() {
    if (this.transport) {
      this.transport.pause();
    }
  }

  private _setupTransport() {
    this.transport = Tone.Transport;

    // ************************************************************
    // main loop
    // ************************************************************
    // on every 16th note...
    this.transport.scheduleRepeat((time) => {
      // increment rhythm index
      this.state.rhythmIndex += 1;

      Tone.Draw.anticipation = 0.23;

      // IMPORTANT: any UI updates need to be called
      // here to not block main thread
      Tone.Draw.schedule(() => {
        // call the current tick increment
        this.onTick(this.state.rhythmIndex);
      }, time);

      // get the next index
      let nextIndex = this.state.rhythmIndex + 1;

      this.state.tracks.forEach((track) => {
        const currentTick = nextIndex % track.pattern.length;
        if (track.pattern[currentTick] > 0) {
          // normal time
          track.play(time, currentTick);
        }
      });

      // use the callback time to schedule events
    }, '16n');

    Tone.Transport.bpm.value = this.bpm;
    Tone.Transport.swing = 0.0167;
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
      ...rhythm,
      updateSelfInParent: this.updateChild,
    });

    await nextTrack.init();

    if (nextTrack.isReady) {
      nextTrack.sampler.connect(this.chain);
    }

    // add
    this.state.tracks = this.state.tracks.concat(nextTrack);

    return nextTrack;
  }

  public repitchTick(
    id: string,
    index: number,
    type: 'INCREMENT' | 'DECREMENT'
  ) {
    let rhythmTarget: Track | undefined = undefined;

    this.state.tracks = this.state.tracks.map((rhythm) => {
      // if we have a target
      if (rhythm.id === id) {
        const track = rhythm.repitchNote(index, type);
        rhythmTarget = track;
        return track;
      }

      return rhythm;
    });

    return [rhythmTarget, this.state.tracks];
  }

  public toggleTick(id: string, index: number): [Track | undefined, Track[]] {
    let rhythmTarget: Track | undefined = undefined;

    this.state.tracks = this.state.tracks.map((rhythm) => {
      // if we have a target
      if (rhythm.id === id) {
        const track = rhythm.toggleNote(index);
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

  public clear() {
    this.state.tracks = this.state.tracks.map((track, index) => {
      return track.noteOff();
    });
  }

  updateChild = (
    child: Track,
    { needsReconnect }: { needsReconnect?: boolean }
  ) => {
    this.state.tracks = this.state.tracks.map((track) => {
      if (track.id === child.id) {
        if (needsReconnect) {
          child.sampler.connect(this.chain);
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

  public async exportJSON(): Promise<SerializedSequencer> {
    return {};
  }
}
