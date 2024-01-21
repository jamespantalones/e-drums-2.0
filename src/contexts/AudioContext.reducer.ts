import { Config } from '../config';
import { AudioContextAction, AudioContextType } from '../types';

export function audioContextReducer(
  state: AudioContextType,
  action: AudioContextAction
) {
  switch (action.type) {
    // private methods
    case 'INITIALIZE': {
      return {
        ...state,
        initialized: true,
        tracks: action.value,
      };
    }

    case 'ADD_TRACK': {
      return {
        ...state,
        tracks: state.tracks.concat(action.value),
      };
    }

    case 'CHANGE_NAME': {
      const nextState = {
        ...state,
        name: action.value,
      };
      return nextState;
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
      };
    }

    case 'DECREMENT_BPM': {
      return {
        ...state,
        bpm: state.bpm - 1 >= Config.MIN_BPM ? state.bpm - 1 : Config.MIN_BPM,
      };
    }

    case 'INCREMENT_BPM': {
      return {
        ...state,
        bpm: state.bpm + 1 <= Config.MAX_BPM ? state.bpm + 1 : Config.MAX_BPM,
      };
    }

    case '_PLAY': {
      return {
        ...state,
        stopCount: 0,
        playing: true,
      };
    }

    case '_STOP': {
      const nextStopCount = state.stopCount + 1;

      if (nextStopCount > 1) {
        return {
          ...state,
          stopCount: nextStopCount,
          tick: -1,
        };
      }
      return {
        ...state,
        stopCount: nextStopCount,
        playing: false,
      };
    }

    case 'DELETE_TRACK': {
      return {
        ...state,
        tracks: state.tracks.filter((t) => t.id !== action.value),
      };
    }

    case 'UPDATE_TRACKS': {
      return {
        ...state,
        tracks: action.value,
      };
    }

    /**
     * updates singular track
     */
    case 'UPDATE_TRACK': {
      return {
        ...state,
        tracks: state.tracks.map((track) => {
          if (track.id == action.value.id) {
            return action.value;
          }
          return track;
        }),
      };
    }

    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
