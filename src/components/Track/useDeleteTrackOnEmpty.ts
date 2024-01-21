import { useEffect } from 'react';
import { Track } from '../../lib/Track';
import { useAudioContext } from '../../contexts/AudioContext';

export function useDeleteTrackOnEmpty(rhythm: Track) {
  const {
    methods: { deleteTrack },
  } = useAudioContext();

  useEffect(() => {
    if (rhythm.pattern.length === 0) {
      deleteTrack(rhythm.id);
    }
  }, [rhythm.pattern.length, rhythm.id, deleteTrack]);
}
