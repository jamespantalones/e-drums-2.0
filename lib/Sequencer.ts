import * as Tone from "tone";
import { Transport } from "tone/build/esm/core/clock/Transport";
import { pubsub } from "./pubsub";
import { SequencerEvents, SequencerPlayState } from "./schema";
import { Time, Track } from "./Track";
import { getBeats, handler } from "./utils";

export interface SequencerOpts {
  initialTracks?: Track[];
}

// ------------------------------------------------------------
// Sequencer Class
// ------------------------------------------------------------
export class Sequencer {
  private state: {
    rhythmIndex: number;
    tracks: Track[];
  };

  public isInit: boolean;

  private reverb!: Tone.Reverb;
  private chain!: Tone.Gain;

  private transport!: Transport;

  playState: SequencerPlayState;

  constructor(opts: SequencerOpts) {
    this.isInit = false;

    this.state = new Proxy(
      {
        rhythmIndex: -1,
        tracks: opts.initialTracks || [],
        _instance: this,
      },
      handler
    );

    this.playState = SequencerPlayState.STOPPED;
  }

  private _addListeners() {
    // when
    pubsub.on(SequencerEvents.INCREMENT_BEAT, (id: string) => {
      this.state.tracks = this.state.tracks.map((t) => {
        if (t.id === id) {
          return t.incrementBeat();
        }
        return t;
      });
    });

    pubsub.on(SequencerEvents.DECREMENT_BEAT, (id: string) => {
      console.log(`DECREMENT_BEAT`, id);
      this.state.tracks = this.state.tracks.map((r) => {
        if (r.id === id) {
          return r.decrementBeat();
        }
        return r;
      });
    });

    pubsub.on(SequencerEvents.INCREMENT_TICK, (id: string) => {
      console.log(`INCREMENT_TICK`, id);
      this.state.tracks = this.state.tracks.map((r) => {
        if (r.id === id) {
          return r.incrementTick();
        }
        return r;
      });
    });

    pubsub.on(SequencerEvents.DECREMENT_TICK, (id: string) => {
      console.log(`DECREMENT_TICK`, id);
      this.state.tracks = this.state.tracks.map((r) => {
        if (r.id === id) {
          return r.decrementTick();
        }
        return r;
      });
    });

    pubsub.on(
      SequencerEvents.FREQUENCY_CHANGE,
      ({ id, value }: { id: string; value: number }) => {
        this.state.tracks = this.state.tracks.map((r) => {
          if (r.id === id) {
            return r.changeFrequency(value);
          }
          return r;
        });
      }
    );

    pubsub.on(SequencerEvents.ADD_NEW_RHYTHM, (rhythm: Track) => {
      const nextTrack = new Track({
        onNotes: rhythm.onNotes,
        totalNotes: rhythm.totalNotes,
        note: rhythm.note,
      });
      nextTrack.audio.connect(this.chain);

      this.state.tracks = this.state.tracks.concat(nextTrack);
    });

    pubsub.on(SequencerEvents.REMOVE_RHYTHM, (id: string) => {
      this.state.tracks = this.state.tracks.filter((r) => r.id !== id);
    });

    pubsub.on(
      SequencerEvents.TOGGLE_TICK,
      ({ id, index }: { id: string; index: number }) => {
        this.state.tracks = this.state.tracks.map((rhythm) => {
          // if we have a target
          if (rhythm.id === id) {
            return rhythm.toggleNote(index, rhythm);
          }

          return rhythm;
        });
      }
    );

    pubsub.on(
      SequencerEvents.ADJUST_TIME_SCALE,
      ({ id, value }: { id: string; value: number }) => {
        this.state.tracks = this.state.tracks.map((r) => {
          if (r.id === id) {
            return r.adjustTimeScale(value);
          }
          return r;
        });
      }
    );
  }

  async init() {
    try {
      await Tone.start();

      this.reverb = new Tone.Reverb();
      this.reverb.wet.value = 0.05;

      this.chain = new Tone.Gain();
      this.chain.chain(this.reverb, Tone.Destination);

      this._addListeners();
      this.isInit = true;
    } catch (err) {
      console.error('B', err);
    }
    
  }

  stop(){
    if (this.transport){
      this.transport.stop();
    }
  }

  async start() {
    if (!this.isInit) {
      console.error("Cannot start without initializing");
    }

    this.transport = Tone.Transport;

    this.transport.scheduleRepeat((time) => {
      // schedule UI update
      Tone.Draw.schedule(() => {
        // increment rhythm index
        this.state.rhythmIndex++;
      }, time);

      // increment rhythm index
      let nextIndex = this.state.rhythmIndex + 1;

      // run the draw update here

      this.state.tracks.forEach((track, index) => {
        if (track.pattern[nextIndex % track.pattern.length]) {
          // normal time
          track.play(time);
        }

        return;

        if (track.time === Time.NORMAL && nextIndex % 2 === 0) {
          if (track.pattern[nextIndex % track.pattern.length]) {
            // normal time
            track.play(time);
          }

          return;
        }

        // half time
        else if (track.time === Time.HALF_TIME && nextIndex % 4 === 0) {
          if (track.pattern[nextIndex % track.pattern.length]) {
            // normal time
            track.play(time);
          }
          return;
        }

        // double time
        else if (track.time === Time.DOUBLE_TIME) {
          if (track.pattern[nextIndex % track.pattern.length]) {
            // normal time
            track.play(time);
          }
          return;
        }

        return;
      });
      // use the callback time to schedule events
    }, "16n");

    Tone.Transport.bpm.value = 69;
    Tone.Transport.swing = 0.05;
    Tone.Transport.start();
  }

  public setBpm(val: number) {
    Tone.Transport.bpm.value = val;
  }
}
