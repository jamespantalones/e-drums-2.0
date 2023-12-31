import type { NextPage } from 'next';
import * as React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';
import { useOfflineStorage } from '../contexts/OfflineStorageContext';
import { useRouter } from 'next/router';
import isMobile from 'is-mobile';

/**
 *
 * @returns
 */
const Track: NextPage = () => {
  const {
    query: { id },
  } = useRouter();

  const {
    state: { tracks },
    state,
    initialize,
    sequencer,
    methods,
  } = useAudioContext();

  console.log({ state });
  const [mobile] = React.useState(isMobile());

  const _controls = useDragControls();

  const { loadProjectFromCache, saveProjectToCache } = useOfflineStorage();

  async function save() {
    if (sequencer) {
      saveProjectToCache(id as string, await sequencer.exportJSON());
    }
  }

  React.useEffect(() => {
    async function load() {
      const project = await loadProjectFromCache(id as string);
      console.log({ project });
      let _song = await initialize({
        ...project,
        bpm: project!.bpm!,
        id: id! as string,
      });
    }

    if (!id) return;

    load();
  }, [id, loadProjectFromCache, initialize]);

  // listen for nav changes

  return (
    <>
      <Nav save={save}>
        <label>
          Name
          <input
            type="text"
            placeholder={id as string}
            value={state.name || ''}
            onChange={methods.changeName}
          />
        </label>
      </Nav>
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

export default Track;
