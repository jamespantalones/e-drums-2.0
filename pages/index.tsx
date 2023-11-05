import type { NextPage } from 'next';
import * as React from 'react';
import Link from 'next/link';
import { generateId } from '../utils';
import { useOfflineStorage } from '../contexts/OfflineStorageContext';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();

  const { appendToIndexCache, projects, removeFromCache } = useOfflineStorage();

  async function createNew() {
    const id = generateId();
    await appendToIndexCache(id);

    router.push(`/${id}`);
  }

  return (
    <section className="p-4">
      <h1 className="text-8xl">/\ Gummersbach</h1>
      <ul>
        {projects.map((p) => (
          <Link href={`/${p}`} className="block " passHref key={p}>
            <li
              key={p}
              className="my-1 flex items-center justify-between p-2 hover:bg-foreground hover:text-background"
            >
              {p}

              <button
                className="border border-current px-1 hover:bg-alert"
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  removeFromCache(p);
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
