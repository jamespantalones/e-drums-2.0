import * as React from "react";
import { pubsub } from "../../lib/pubsub";
import {
  Sequencer,
  SequencerEvents,
  SequencerRhythm,
} from "../../lib/Sequencer";
import { generateId } from "../../utils";

const initialRhythms: SequencerRhythm[] = [
  {
    onNotes: 4,
    totalNotes: 16,
    note: 200,
    id: generateId(),
  },
];

export function useSequencer() {
  const [bpm, setBpm] = React.useState(100);
  const [rhythms, setRhythms] = React.useState(initialRhythms);
  const [tick, setTick] = React.useState(-1);

  const ctx = React.useRef<Sequencer | null>(
    new Sequencer({
      initialRhythms,
    })
  );

  const decrementBeat = React.useCallback((rhythm: SequencerRhythm) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.DECREMENT_BEAT, rhythm.id);
    };
  }, []);

  const decrementTick = React.useCallback((rhythm: SequencerRhythm) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.DECREMENT_TICK, rhythm.id);
    };
  }, []);

  const incrementBeat = React.useCallback((rhythm: SequencerRhythm) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.INCREMENT_BEAT, rhythm.id);
    };
  }, []);

  const changeFrequency = React.useCallback((rhythm: SequencerRhythm) => {
    return function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
      pubsub.emit(SequencerEvents.FREQUENCY_CHANGE, {
        id: rhythm.id,
        value: parseInt(ev.target.value, 10),
      });
    };
  }, []);

  const incrementTick = React.useCallback((rhythm: SequencerRhythm) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.INCREMENT_TICK, rhythm.id);
    };
  }, []);

  const play = React.useCallback(async () => {
    if (!ctx.current) {
      return;
    }
    await ctx.current.start();
  }, []);

  const handleBpmChange = React.useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseInt(ev.target.value, 10);
      setBpm(val);
      if (ctx.current) {
        ctx.current.setBpm(val);
      }
    },
    []
  );

  const createNewTrack = React.useCallback(() => {
    const rhythm = {
      id: generateId(),
      onNotes: 2,
      totalNotes: 4,
      note: 420,
    };
    pubsub.emit(SequencerEvents.ADD_NEW_RHYTHM, rhythm);
  }, []);

  // events
  React.useEffect(() => {
    function onTick(tick: number) {
      setTick((t) => (tick !== t ? tick : t));
    }

    function onRhythmChange(rhythms: SequencerRhythm[]) {
      setRhythms(rhythms);
    }
    pubsub.on(SequencerEvents.TICK, onTick);
    pubsub.on(SequencerEvents.RHYTHM_CHANGE, onRhythmChange);

    return () => {
      pubsub.off(SequencerEvents.TICK, onTick);
      pubsub.off(SequencerEvents.RHYTHM_CHANGE, onRhythmChange);
    };
  }, []);

  return {
    bpm,
    handleBpmChange,
    play,
    ctx,
    rhythms,
    tick,
    decrementBeat,
    decrementTick,
    incrementBeat,
    incrementTick,
    createNewTrack,
    changeFrequency,
  };
}
