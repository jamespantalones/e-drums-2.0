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

  const { projects, removeFromCache, saveProjectToCache, fetchIndexCache } =
    useOfflineStorage();

  /**
   * Create a new sequencer
   */
  async function createNew() {
    const id = generateId();
    const seq = new Sequencer({
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
      <nav className="flex w-full justify-between items-center">
        <h1 className="text-8xl mb-8">
          <span className="inline-block">E</span>-Drums
        </h1>
        <div>
          <Link href="/about" className="border-b">
            About
          </Link>
        </div>
      </nav>
      {/* 
      <table className="w-full text-left text-xs">
        <thead>
          <tr>
            <th>Name</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.updatedAt}</td>
              <td>
                <button
                  className="border border-current p-1 hover:bg-alert text-xs rounded"
                  onClick={async (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    await removeFromCache(p.id);
                    await fetchIndexCache();
                  }}
                >
                  DEL
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}

      <ul className="text-xs">
        <li className="my-1 flex items-center justify-between p-2 border-b">
          <div className="w-1/2 text-xs">Name</div>
          <div className="text-xs w-1/3">Updated</div>
          <button
            disabled
            className="opacity-0 border border-current p-1 text-xs"
          >
            DEL
          </button>
        </li>
        {projects.map((p) => (
          <Link href={`/${p.id}`} className="block " passHref key={p.id}>
            <li
              key={p.id}
              className="my-1 flex items-center justify-between p-2 hover:bg-foreground hover:text-background"
            >
              <div className="w-1/2">{p.name}</div>
              <div className="text-xs w-1/3">{p.updatedAt}</div>
              <button
                className="border border-current p-1 hover:bg-alert text-xs rounded"
                onClick={async (ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  await removeFromCache(p.id);
                  await fetchIndexCache();
                }}
              >
                DEL
              </button>
            </li>
          </Link>
        ))}
      </ul>
      <button
        className="fixed bottom-8 right-8 border border-current p-2 rounded hover:bg-foreground hover:text-background text-xs"
        onClick={createNew}
      >
        + Create New
      </button>
    </section>
  );
};

export default Home;
