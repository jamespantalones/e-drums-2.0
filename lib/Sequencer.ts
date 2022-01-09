import * as Tone from "tone";
import { euclideanRhythm } from "./euclideanRhythm";

export enum SequencerPlayState {
  "STOPPED",
  "STARTED",
}

export interface SequencerRhythm {
  onNotes: number;
  totalNotes: number;

  note: string;
}

const getBeats = (rhythm: { onNotes: number; totalNotes: number }) => {
  return euclideanRhythm(rhythm.onNotes, rhythm.totalNotes);
};

const handler: ProxyHandler<{
  _instance: Sequencer;
  rhythmIndex: number;
}> = {
  set(obj, prop, value) {
    // The default behavior to store the value
    // @ts-ignore
    obj[prop as string] = value;
    obj._instance.pub(JSON.stringify({ key: prop, value }));

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
  };

  private isInit: boolean;

  rhythms: SequencerRhythm[];

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
        _instance: this,
      },
      handler
    );

    this.rhythms = opts.initialRhythms || [
      {
        onNotes: 4,
        totalNotes: 16,
        note: "C2",
      },
      {
        onNotes: 7,
        totalNotes: 11,
        note: "D3",
      },
      {
        onNotes: 5,
        totalNotes: 9,
        note: "F4",
      },
    ];

    this.playState = SequencerPlayState.STOPPED;
  }

  async start() {
    if (!this.isInit) {
      await Tone.start();
      this.audio.synth1 = new Tone.MembraneSynth().toDestination();
      this.audio.synth2 = new Tone.MembraneSynth().toDestination();
      this.audio.synth3 = new Tone.MembraneSynth().toDestination();
      this.isInit = true;
    }

    Tone.Transport.scheduleRepeat((time) => {
      if (!this.audio.synth1) {
        return;
      }
      this.state.rhythmIndex += 1;

      this.rhythms.forEach((rhythm, index) => {
        const beats = getBeats(rhythm);
        if (beats[this.state.rhythmIndex % beats.length]) {
          if (index === 0) {
            this.audio.synth2!.triggerAttackRelease(rhythm.note, "32n", time);
            return;
          }
          if (index === 2) {
            this.audio.synth3!.triggerAttackRelease(rhythm.note, "32n", time);
          }
          this.audio.synth1!.triggerAttackRelease(rhythm.note, "32n", time);
        }
      });
      // use the callback time to schedule events
    }, "16n");

    Tone.Transport.bpm.value = 69;
    Tone.Transport.start();
  }

  public pub(msg: string) {
    console.log(`broadcast: ${msg}`);
  }
}
