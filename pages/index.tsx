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
              className="border-b border-current flex items-center justify-between my-4 hover:bg-current"
            >
              {p}

              <button
                className="border border-current px-1 mb-2"
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
      <button className="border border-current p-2 rounded" onClick={createNew}>
        + Create New
      </button>
    </section>
  );
};

export default Home;
