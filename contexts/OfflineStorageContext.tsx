import { ReactNode, createContext, useContext, useEffect, useRef } from 'react';
import { get, set } from 'idb-keyval';
import { Config } from '../config';

type OfflineCacheMaster = {
  // matches to URL
  [key: string]: undefined;
};

const OfflineStorageContext = createContext(undefined);
export function OfflineStorageProvider({ children }: { children: ReactNode }) {
  const cacheMaster = useRef();

  useEffect(() => {
    get(`${Config.CACHE_PREFIX}/${Config.CACHE_MASTER}`)
      .then((val) => {
        console.log('VAL', val);
      })
      .catch(console.error);
  });
  return (
    <OfflineStorageContext.Provider value={undefined}>
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
