import type { NextPage } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { generateId, noop } from '../utils';
import { useOfflineStorage } from '../contexts/OfflineStorageContext';
import { useRouter } from 'next/router';
import { Sequencer } from '../lib/Sequencer';
import { Config } from '../config';
import { generateTrack } from '../lib/utils';

const Home: NextPage = () => {
  const router = useRouter();

  const { projects, removeFromCache, saveProjectToCache } = useOfflineStorage();

  /**
   * Create a new sequencer
   */
  async function createNew() {
    const id = generateId();
    const seq = new Sequencer({
      name: id,
      onTick: noop,
      bpm: Config.DEFAULT_BPM,
      initialTracks: [generateTrack(0)],
      id,
    });

    const json = await seq.exportJSON();

    await saveProjectToCache(id, {
      ...json,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    router.push(`/${id}`);
  }

  return (
    <section className="p-4">
      <h1 className="text-8xl">
        <span className="inline-block">E</span>-Drums
      </h1>
      <ul>
        {projects.map((p) => (
          <Link href={`/${p.id}`} className="block " passHref key={p.id}>
            <li
              key={p.id}
              className="my-1 flex items-center justify-between p-2 hover:bg-foreground hover:text-background"
            >
              <div className="w-1/2">{p.name}</div>
              <div className="text-xs">{p.updatedAt}</div>
              <button
                className="border border-current p-1 hover:bg-alert text-xs"
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  removeFromCache(p.id);
                }}
              >
                DEL
              </button>
            </li>
          </Link>
        ))}
      </ul>
      <button
        className="fixed bottom-8 right-8 border border-current p-2 rounded hover:bg-foreground hover:text-background"
        onClick={createNew}
      >
        + Create New
      </button>
    </section>
  );
};

export default Home;
