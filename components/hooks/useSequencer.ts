import * as React from "react";
import { pubsub } from "../../lib/pubsub";
import { SequencerEvents } from "../../lib/schema";
import { Sequencer } from "../../lib/Sequencer";
import { Time, Track } from "../../lib/Track";
import { generateId } from "../../utils";

const initialTracks: Track[] = [];

export function useSequencer() {
  const [bpm, setBpm] = React.useState(113);
  const [tracks, setTracks] = React.useState(initialTracks);
  const [tick, setTick] = React.useState(-1);
  const [isInit, setIsInit] = React.useState(false);

  const ctx = React.useRef<Sequencer | null>(
    new Sequencer({
      initialTracks,
    })
  );

  const decrementBeat = React.useCallback((track: Track) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.DECREMENT_BEAT, track.id);
    };
  }, []);

  const decrementTick = React.useCallback((rhythm: Track) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.DECREMENT_TICK, rhythm.id);
    };
  }, []);

  const incrementBeat = React.useCallback((rhythm: Track) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.INCREMENT_BEAT, rhythm.id);
    };
  }, []);

  const deleteTrack = React.useCallback((rhythm: Track) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.REMOVE_RHYTHM, rhythm.id);
    };
  }, []);

  const changeFrequency = React.useCallback((rhythm: Track) => {
    return function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
      pubsub.emit(SequencerEvents.FREQUENCY_CHANGE, {
        id: rhythm.id,
        value: parseInt(ev.target.value, 10),
      });
    };
  }, []);

  const incrementTick = React.useCallback((rhythm: Track) => {
    return function handleClick(ev: React.MouseEvent<HTMLButtonElement>) {
      pubsub.emit(SequencerEvents.INCREMENT_TICK, rhythm.id);
    };
  }, []);

  const toggleTick = React.useCallback((id: string, index: number) => {
    pubsub.emit(SequencerEvents.TOGGLE_TICK, { id, index });
  }, []);

  const adjustTimeScale = React.useCallback((rhythm: Track, time: Time) => {
    return function onClick(ev: React.MouseEvent<HTMLButtonElement>) {
      console.log(rhythm, time);
      rhythm.time = time;
      pubsub.emit(SequencerEvents.ADJUST_TIME_SCALE, {
        id: rhythm.id,
        value: time,
      });
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



  const init = React.useCallback(async () => {
    if (!ctx.current) {
      return;
    }
    await ctx.current.init();
    setIsInit(true);
  }, []);

  // events
  React.useEffect(() => {
    function onTick(tick: number) {
      setTick((t) => (tick !== t ? tick : t));
    }

    function onRhythmChange(rhythms: Track[]) {
      setTracks(rhythms);
    }
    pubsub.on(SequencerEvents.TICK, onTick);
    pubsub.on(SequencerEvents.RHYTHM_CHANGE, onRhythmChange);

    return () => {
      pubsub.off(SequencerEvents.TICK, onTick);
      pubsub.off(SequencerEvents.RHYTHM_CHANGE, onRhythmChange);
    };
  }, []);

  return {
    adjustTimeScale,
    bpm,
    handleBpmChange,
    play,
    ctx,
    tracks,
    tick,
    deleteTrack,
    decrementBeat,
    decrementTick,
    incrementBeat,
    incrementTick,
    changeFrequency,
    toggleTick,
    init,
    isInit,
  };
}
