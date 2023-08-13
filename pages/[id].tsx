import type { NextPage } from 'next';
import * as React from 'react';
import { Splash } from '../components/Splash/Splash';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';
import { useOfflineStorage } from '../contexts/OfflineStorageContext';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const {
    state: { tracks, initialized },
    initialize,
    sequencer,
  } = useAudioContext();

  const { loadProjectFromCache, saveProjectToCache } = useOfflineStorage();

  async function save() {
    if (sequencer) {
      saveProjectToCache(id as string, await sequencer.exportJSON());
    }
  }

  React.useEffect(() => {
    if (!id) return;

    loadProjectFromCache(id as string).then((project) => {
      if (project) {
        initialize(project);
      } else {
        initialize();
      }
    });
  }, [id]);

  return (
    <>
      <Nav save={save} />
      <main>
        <div className="edit__area">
          {tracks.map((rhythm, index) => (
            <TrackItem key={rhythm.id} rhythm={rhythm} index={index} />
          ))}
        </div>
      </main>
    </>
  );
};

export default Home;
