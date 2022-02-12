import { AudioContextAction, AudioContextType } from "./AudioContext.types";

export function audioContextReducer(
  state: AudioContextType,
  action: AudioContextAction
) {
  switch (action.type) {
    // private methods
    case '_INITIALIZE': {
      return {
        ...state,
        initialized: true,
      };
    }

    case 'INCREMENT_TICK': {
      return {
        ...state,
        tick: state.tick + 1,
      };
    }

    case 'SET_BPM': {
      return {
        ...state,
        bpm: action.value,
      }
    }

    case '_PLAY': {
      return {
        ...state,
        playing: true,
      };
    }

    case '_STOP': {
      return {
        ...state,
        playing: false,
      };
    }

    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}