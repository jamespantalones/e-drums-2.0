import type { NextPage } from 'next';
import * as React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';
import { useOfflineStorage } from '../contexts/OfflineStorageContext';
import { useRouter } from 'next/router';
import isMobile from 'is-mobile';

const Home: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const {
    state: { tracks },
    initialize,
    sequencer,
    methods,
  } = useAudioContext();
  const [mobile] = React.useState(isMobile());

  const controls = useDragControls();

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
  }, [id, loadProjectFromCache, initialize]);

  // listen for nav changes

  return (
    <>
      <Nav save={save} />
      <main>
        <Reorder.Group
          axis="y"
          className="edit__area"
          onReorder={methods.reorderTracks}
          values={tracks}
        >
          {tracks.map((rhythm, index) => (
            <TrackItem
              key={rhythm.id}
              rhythm={rhythm}
              index={index}
              mobile={mobile}
            />
          ))}
        </Reorder.Group>
      </main>
    </>
  );
};

export default Home;
