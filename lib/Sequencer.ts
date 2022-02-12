import * as Tone from "tone";
import { Transport } from "tone/build/esm/core/clock/Transport";
import { pubsub } from "./pubsub";
import { SequencerEvents, SequencerPlayState } from "./schema";
import { Track } from "./Track";
import { handler } from "./utils";

export interface SequencerOpts {
  initialTracks?: Track[];

  bpm: number;

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

  public bpm: number;

  public onTick: (tick: number) => void;

  public isInit: boolean;

  private reverb!: Tone.Reverb;
  private chain!: Tone.Gain;

  private transport!: Transport;

  playState: SequencerPlayState;

  constructor(opts: SequencerOpts) {
    this.isInit = false;
    this.bpm = opts.bpm;
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

  // stop the transport
  stop(){
    if (this.transport){
      this.transport.pause();
    }
  }

  private _setupTransport(){
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
    }, "16n");

    Tone.Transport.bpm.value = this.bpm;
    Tone.Transport.swing = 0.05;
  }

  async start() {
    if (!this.isInit) {
      await this.init();
    }

    // if transport hasn't been set up.. set it up
    if (!this.transport){
     this._setupTransport();
    }

    Tone.Transport.start();
  }


  public async addNewRhythm(rhythm: Pick<Track, 'onNotes' | 'totalNotes' | 'note'>): Promise<Track>{
    
    if (!this.isInit) {
      await this.init();
    }
    
    const nextTrack = new Track({
      onNotes: rhythm.onNotes,
      totalNotes: rhythm.totalNotes,
      note: rhythm.note,
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

  updateChild = (child: Track) => {
    this.state.tracks = this.state.tracks.map(track => {
      if (track.id === child.id){
        return child;
      }
      return track;
    })

  }

  public deleteTrack(id: string): [string, Track[]]{
    this.state.tracks = this.state.tracks.filter((r) => r.id !== id);
    return [id, this.state.tracks];
  }
}
