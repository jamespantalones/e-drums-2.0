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

  const [mobile] = React.useState(isMobile());

  const _controls = useDragControls();

  const { loadProjectFromCache, saveProjectToCache } = useOfflineStorage();

  const save = async (localName?: string) => {
    console.log({ localName });
    if (!sequencer) return;
    await saveProjectToCache(id as string, {
      ...sequencer.exportJSON(),
      name: localName || state.name,
      updatedAt: new Date().toISOString(),
    });
  };

  React.useEffect(() => {
    async function load() {
      const project = await loadProjectFromCache(id as string);
      let _song = await initialize(project);
    }

    if (!id) return;

    load();
  }, [id, loadProjectFromCache, initialize]);

  async function updateName(ev: React.ChangeEvent<HTMLInputElement>) {
    if (!sequencer) return;
    methods.changeName(ev);
    // send copy to sequencer for serialization on save
    sequencer.name = ev.target.value;

    save(ev.target.value);
  }

  function handleKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === 'Enter') {
      if (ev.target) {
        (ev.target as HTMLInputElement).blur();
      }
    }
  }

  return (
    <>
      <Nav save={() => save()}>
        <label className="block text-xxs">
          Name
          <input
            className="text-xs block py-1 bg-transparent border-b border-current"
            type="text"
            placeholder={id as string}
            defaultValue={state.name || ''}
            onChange={updateName}
            onKeyDown={handleKeyDown}
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
