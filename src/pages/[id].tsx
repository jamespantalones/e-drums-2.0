import type { NextPage } from 'next';
import * as React from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { Reorder, useDragControls } from 'framer-motion';
import { Nav } from '../components/Nav/Nav';
import { TrackItem } from '../components/Track/Track';
import { useAudioContext } from '../contexts/AudioContext';
import { useOfflineStorage } from '../contexts/OfflineStorageContext';
import { useRouter } from 'next/router';
import isMobile from 'is-mobile';
import { useHotKeys } from '../hooks/useHotKeys';
import { SIG_NAME, SIG_SEQUENCER, SIG_TRACKS } from '../state/track';

/**
 *
 * @returns
 */
const Track: NextPage = () => {
  useSignals();

  const {
    query: { id },
  } = useRouter();

  const { initialize, methods } = useAudioContext();

  const [mobile] = React.useState(isMobile());

  const _controls = useDragControls();

  const { loadProjectFromCache, saveProjectToCache } = useOfflineStorage();

  const save = async (_localName?: string) => {
    if (!SIG_SEQUENCER.value) return;

    await saveProjectToCache(id as string, {
      ...SIG_SEQUENCER.value.exportJSON(),
      name: SIG_NAME.value,
      updatedAt: new Date().toISOString(),
    });
  };

  React.useEffect(() => {
    async function load() {
      const project = await loadProjectFromCache(id as string);
      await initialize(project);
    }

    if (!id) return;

    load();
  }, [id, loadProjectFromCache, initialize]);

  async function updateName(ev: React.ChangeEvent<HTMLInputElement>) {
    SIG_NAME.value = ev.target.value;
  }

  // allow enter key to blur input
  function handleKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {
    if (ev.key === 'Enter') {
      if (ev.target) {
        (ev.target as HTMLInputElement).blur();
      }
    }
  }

  // all hot-keys require commande
  useHotKeys({ 'Meta+s': save, 'Ctrl+n': methods.createTrack });

  return (
    <>
      <Nav save={() => save()}>
        <label className="block text-xxs">
          Name
          <input
            className="text-xs block py-1 bg-transparent border-b border-current"
            type="text"
            placeholder={id as string}
            defaultValue={SIG_NAME.value || id}
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
          values={SIG_TRACKS.value}
        >
          {SIG_TRACKS.value.map((rhythm, index) => (
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
