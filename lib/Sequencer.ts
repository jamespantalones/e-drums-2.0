import * as Tone from "tone";
import { Transport } from "tone/build/esm/core/clock/Transport";
import { pubsub } from "./pubsub";
import { SequencerEvents, SequencerPlayState } from "./schema";
import { Time, Track } from "./Track";
import { getBeats, handler } from "./utils";

export interface SequencerOpts {
  initialTracks?: Track[];

  onTick: (tickVal: number) => void;
}

// ------------------------------------------------------------
// Sequencer Class
// ------------------------------------------------------------
export class Sequencer {
  private state: {
    rhythmIndex: number;
    tracks: Track[];
  };

  public onTick: (tick: number) => void;

  public isInit: boolean;

  private reverb!: Tone.Reverb;
  private chain!: Tone.Gain;

  private transport!: Transport;

  playState: SequencerPlayState;

  constructor(opts: SequencerOpts) {
    this.isInit = false;

    this.onTick = opts.onTick;

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

    

    pubsub.on(SequencerEvents.REMOVE_RHYTHM, (id: string) => {
      this.state.tracks = this.state.tracks.filter((r) => r.id !== id);
    });

    pubsub.on(
      SequencerEvents.TOGGLE_TICK,
      ({ id, index }: { id: string; index: number }) => {
        
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
      await this.init();
    }

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

      

      this.state.tracks.forEach((track, index) => {
        if (track.pattern[nextIndex % track.pattern.length]) {
          // normal time
          track.play(time);
        }
      });
      // use the callback time to schedule events
    }, "16n");

    Tone.Transport.bpm.value = 69;
    Tone.Transport.swing = 0.05;
    Tone.Transport.start();
  }


  public async addNewRhythm(rhythm: Pick<Track, 'onNotes' | 'totalNotes' | 'note'>): Promise<Track>{
    
    if (!this.isInit) {
      console.error("Cannot start without initializing");
      await this.init();
    }
    
    const nextTrack = new Track({
      onNotes: rhythm.onNotes,
      totalNotes: rhythm.totalNotes,
      note: rhythm.note,
    });

    nextTrack.audio.connect(this.chain);

    // add
    this.state.tracks = this.state.tracks.concat(nextTrack);

    return nextTrack;
  }

  public toggleTick(id: string, index: number): [Track | undefined, Track[]]{

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
}
