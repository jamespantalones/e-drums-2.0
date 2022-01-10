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

  REMOVE_RHYTHM = "REMOVE_RHYTHM",

  RHYTHM_CHANGE = "RHYTHM_CHANGE",
  TOGGLE_TICK = "TOGGLE_TICK",

  FREQUENCY_CHANGE = "FREQUENCY_CHANGE",
}

export interface SequencerRhythm {
  onNotes: number;
  totalNotes: number;

  synth?:
    | Tone.Synth
    | Tone.MonoSynth
    | Tone.PluckSynth
    | Tone.MembraneSynth
    | Tone.MetalSynth;

  note: number;
  id: string;

  // has user clicked to edit
  pattern?: number[];
}

export const getBeats = (rhythm: SequencerRhythm): number[] => {
  if (rhythm.pattern) {
    return rhythm.pattern;
  }
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
  public synths: (
    | Tone.Synth
    | Tone.MonoSynth
    | Tone.NoiseSynth
    | Tone.PluckSynth
  )[];

  private state: {
    rhythmIndex: number;
    rhythms: SequencerRhythm[];
  };

  private isInit: boolean;

  playState: SequencerPlayState;

  constructor(opts: SequencerOpts) {
    this.synths = [];

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
      const reverb = new Tone.Reverb().toDestination();
      reverb.wet.value = 0.05;

      this.synths = [
        new Tone.MonoSynth().connect(reverb),
        new Tone.MonoSynth().connect(reverb),
        new Tone.NoiseSynth().connect(reverb),
        new Tone.PluckSynth().connect(reverb),
        new Tone.MembraneSynth().connect(reverb),
      ];
      this.isInit = true;

      pubsub.on(SequencerEvents.INCREMENT_BEAT, (id: string) => {
        this.state.rhythms = this.state.rhythms.map((r) => {
          if (r.id === id) {
            return {
              ...r,
              pattern: undefined,
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
              pattern: undefined,
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
              pattern: undefined,
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
              pattern: undefined,
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
        this.state.rhythms = this.state.rhythms.concat([
          {
            ...rhythm,
            // @ts-ignore
            synth: this.synths[Math.floor(Math.random() * this.synths.length)],
          },
        ]);
      });

      pubsub.on(SequencerEvents.REMOVE_RHYTHM, (id: string) => {
        this.state.rhythms = this.state.rhythms.filter((r) => r.id !== id);
      });

      pubsub.on(
        SequencerEvents.TOGGLE_TICK,
        ({ id, index }: { id: string; index: number }) => {
          this.state.rhythms = this.state.rhythms.map((rhythm) => {
            // if we have a target
            if (rhythm.id === id) {
              // if we already have a pattern
              if (rhythm.pattern) {
                return {
                  ...rhythm,
                  pattern: rhythm.pattern.map((p, i) => {
                    if (i === index) {
                      return 1 - p;
                    }
                    return p;
                  }),
                };
              }

              // otherwise, turn the euclidean version into a pattern and edit
              return {
                ...rhythm,
                pattern: getBeats(rhythm).map((p, i) => {
                  if (i === index) {
                    return 1 - p;
                  }
                  return p;
                }),
              };
            }

            return rhythm;
          });
        }
      );
    }

    const _loop = Tone.Transport.scheduleRepeat((time) => {
      Tone.Draw.schedule(() => {
        // increment rhythm index
        this.state.rhythmIndex++;
      }, time);

      let nextIndex = this.state.rhythmIndex + 1;

      // run the draw update here

      this.state.rhythms.forEach((rhythm, index) => {
        const beats = getBeats(rhythm);
        if (beats[nextIndex % beats.length]) {
          rhythm.synth!.triggerAttackRelease(rhythm.note, "32n", time);
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
