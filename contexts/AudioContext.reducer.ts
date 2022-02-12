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

    case 'ADD_TRACK': {
      return {
        ...state,
        tracks: state.tracks.concat(action.value)
      }
    }

    case 'INCREMENT_TICK': {
      return {
        ...state,
        tick: action.value,
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

    case 'UPDATE_TRACKS': {
      return {
        ...state,
        tracks: action.value,
      }
    }

    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}