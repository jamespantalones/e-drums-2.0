import * as Tone from "tone";
import { euclideanRhythm } from "./euclideanRhythm";
import { pubsub } from "./pubsub";

export enum SequencerPlayState {
  "STOPPED",
  "STARTED",
}

export enum SequencerEvents {
  TICK = "TICK",

  ADD_NEW_RHYTHM = "ADD_NEW_RHYTHM",

  DECREMENT_BEAT = "DECREMENT_BEAT",
  DECREMENT_TICK = "DECREMENT_TICK",

  INCREMENT_BEAT = "INCREMENT_BEAT",

  INCREMENT_TICK = "INCREMENT_TICK",

  RHYTHM_CHANGE = "RHYTHM_CHANGE",

  FREQUENCY_CHANGE = "FREQUENCY_CHANGE",
}

export interface SequencerRhythm {
  onNotes: number;
  totalNotes: number;

  note: number;
  id: string;
}

export const getBeats = (rhythm: SequencerRhythm): number[] => {
  return euclideanRhythm(rhythm.onNotes, rhythm.totalNotes);
};

const handler: ProxyHandler<{
  _instance: Sequencer;
  rhythmIndex: number;
  rhythms: SequencerRhythm[];
}> = {
  set(obj, prop, value) {
    // The default behavior to store the value
    // @ts-ignore
    obj[prop as string] = value;

    if (prop === "rhythms") {
      pubsub.emit<SequencerEvents>(SequencerEvents.RHYTHM_CHANGE, value);
    }

    if (prop === "rhythmIndex") {
      pubsub.emit<SequencerEvents>(SequencerEvents.TICK, value);
    }

    return true;
  },
};

export interface SequencerOpts {
  initialRhythms?: SequencerRhythm[];
}

export class Sequencer {
  private audio: {
    synth1: Tone.Synth | null;
    synth2: Tone.Synth | null;
    synth3: Tone.Synth | null;
  };

  private state: {
    rhythmIndex: number;
    rhythms: SequencerRhythm[];
  };

  private isInit: boolean;

  playState: SequencerPlayState;

  constructor(opts: SequencerOpts) {
    this.audio = {
      synth1: null,
      synth2: null,
      synth3: null,
    };

    this.isInit = false;

    this.state = new Proxy(
      {
        rhythmIndex: -1,
        rhythms: opts.initialRhythms || [],
        _instance: this,
      },
      handler
    );

    this.playState = SequencerPlayState.STOPPED;
  }

  async start() {
    if (!this.isInit) {
      await Tone.start();
      this.audio.synth1 = new Tone.MembraneSynth().toDestination();
      this.audio.synth2 = new Tone.MembraneSynth().toDestination();
      this.audio.synth3 = new Tone.MembraneSynth().toDestination();
      this.isInit = true;

      pubsub.on(SequencerEvents.INCREMENT_BEAT, (id: string) => {
        console.log(`INCREMENT_BEAT`, id);
        this.state.rhythms = this.state.rhythms.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              onNotes:
                r.onNotes + 1 <= r.totalNotes ? r.onNotes + 1 : r.onNotes,
            };
          }
          return r;
        });
      });

      pubsub.on(SequencerEvents.DECREMENT_BEAT, (id: string) => {
        console.log(`DECREMENT_BEAT`, id);
        this.state.rhythms = this.state.rhythms.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              onNotes: r.onNotes - 1 >= 0 ? r.onNotes - 1 : r.onNotes,
            };
          }
          return r;
        });
      });

      pubsub.on(SequencerEvents.INCREMENT_TICK, (id: string) => {
        console.log(`INCREMENT_TICK`, id);
        this.state.rhythms = this.state.rhythms.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              totalNotes:
                r.totalNotes + 1 <= 256 ? r.totalNotes + 1 : r.totalNotes,
            };
          }
          return r;
        });
      });

      pubsub.on(SequencerEvents.DECREMENT_TICK, (id: string) => {
        console.log(`DECREMENT_TICK`, id);
        this.state.rhythms = this.state.rhythms.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              totalNotes:
                r.totalNotes - 1 >= 0 ? r.totalNotes - 1 : r.totalNotes,
            };
          }
          return r;
        });
      });

      pubsub.on(
        SequencerEvents.FREQUENCY_CHANGE,
        ({ id, value }: { id: string; value: number }) => {
          console.log(`FREQ CHANGE`, id);
          this.state.rhythms = this.state.rhythms.map((r) => {
            if (r.id === id) {
              return {
                ...r,
                note: value,
              };
            }
            return r;
          });
        }
      );

      pubsub.on(SequencerEvents.ADD_NEW_RHYTHM, (rhythm: SequencerRhythm) => {
        this.state.rhythms = this.state.rhythms.concat(rhythm);
      });
    }

    const _loop = Tone.Transport.scheduleRepeat((time) => {
      if (!this.audio.synth1) {
        return;
      }

      // increment rhythm index
      this.state.rhythmIndex++;

      pubsub.emit<SequencerEvents>(
        SequencerEvents.TICK,
        this.state.rhythmIndex
      );

      this.state.rhythms.forEach((rhythm, index) => {
        const beats = getBeats(rhythm);
        if (beats[this.state.rhythmIndex % beats.length]) {
          if (index === 0) {
            this.audio.synth2!.triggerAttackRelease(rhythm.note, "32n", time);
            return;
          }
          if (index === 2) {
            this.audio.synth3!.triggerAttackRelease(rhythm.note, "32n", time);
            return;
          }
          this.audio.synth1!.triggerAttackRelease(rhythm.note, "32n", time);
        }
      });
      // use the callback time to schedule events
    }, "16n");

    Tone.Transport.bpm.value = 69;
    Tone.Transport.start();
  }

  public setBpm(val: number) {
    Tone.Transport.bpm.value = val;
  }
}
