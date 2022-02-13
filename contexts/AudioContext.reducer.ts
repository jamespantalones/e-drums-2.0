import { AudioContextAction, AudioContextType } from "../types";

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

    case 'DELETE_TRACK': {
      return {
        ...state,
        tracks: state.tracks.filter(t => t.id !== action.value),
      }
    }

    case 'UPDATE_TRACKS': {
      return {
        ...state,
        tracks: action.value,
      }
    }

    case 'UPDATE_TRACK': {
      return {
        ...state,
        tracks: state.tracks.map(track => {
          if (track.id == action.value.id){
            return action.value;
          }
          return track;
        })
      }
    }

    default: {
      // @ts-ignore
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}