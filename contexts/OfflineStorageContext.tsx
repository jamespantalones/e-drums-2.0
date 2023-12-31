import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { del, get, set } from 'idb-keyval';
import { Config } from '../config';
import { SerializedSequencer } from '../types';
import { setDefaultResultOrder } from 'dns/promises';
import { useRouter } from 'next/router';

const OfflineStorageContext = createContext<
  | {
      appendToIndexCache: (id: string) => Promise<void>;
      removeFromCache: (id: string) => Promise<void>;
      loadProjectFromCache: (
        id: string
      ) => Promise<SerializedSequencer | undefined>;
      projects: string[];
      retrieveIndexCache: () => Promise<string[]>;
      saveProjectToCache: (id: string, data: string) => Promise<void>;
    }
  | undefined
>(undefined);

const INDEX = `${Config.CACHE_PREFIX}/${Config.CACHE_MASTER}`;

export function OfflineStorageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const cacheMaster = useRef<string[]>();
  const [projects, setProjects] = useState<string[]>([]);

  async function appendToIndexCache(id: string) {
    const val = await get<string[]>(INDEX);
    if (!val) {
      throw new Error('Cache not ready');
    }
    const nextVal = val.concat(id);
    await set(INDEX, nextVal);
  }

  async function createIndexCache() {
    await set(INDEX, []);
    return get<string[]>(INDEX);
  }

  async function loadProjectFromCache(
    id: string
  ): Promise<SerializedSequencer | undefined> {
    const val = await get<string>(`${Config.CACHE_PREFIX}/${id}`);
    if (val) {
      return JSON.parse(val);
    }

    return undefined;
  }

  async function saveProjectToCache(id: string, data: string) {
    await set(`${Config.CACHE_PREFIX}/${id}`, data);
  }

  async function removeFromCache(id: string) {
    // delete item
    await del(`${Config.CACHE_PREFIX}/${id}`);

    // delete from index
    const val = await get<string[]>(INDEX);
    if (!val) return;

    const nextVals = val.filter((v) => v !== id);
    setProjects(nextVals);
    await set(INDEX, nextVals);
  }

  const retrieveIndexCache = useCallback(async (): Promise<string[]> => {
    let val: string[] | undefined;
    try {
      val = await get<string[]>(
        `${Config.CACHE_PREFIX}/${Config.CACHE_MASTER}`
      );
      if (!val) {
        val = await createIndexCache();
      }
      return val || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  }, []);

  useEffect(() => {
    retrieveIndexCache().then((cache) => {
      if (cache) {
        cacheMaster.current = cache;
        setProjects(cache);
      }
    });
  }, [retrieveIndexCache, router.asPath]);

  return (
    <OfflineStorageContext.Provider
      value={{
        appendToIndexCache,
        retrieveIndexCache,
        projects,
        loadProjectFromCache,
        saveProjectToCache,
        removeFromCache,
      }}
    >
      {children}
    </OfflineStorageContext.Provider>
  );
}
export function useOfflineStorage() {
  const context = useContext(OfflineStorageContext);
  if (context === undefined) {
    throw new Error(
      `useOfflineStorage must be used within an OfflineStorageProvider`
    );
  }

  return context;
}
