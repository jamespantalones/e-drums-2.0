import { ReactNode, createContext, useContext } from 'react';

const OfflineStorageContext = createContext(undefined);
export function OfflineStorageProvider({ children }: { children: ReactNode }) {
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
      `useAudioContext must be used within an AudioContextProvider`
    );
  }

  return context;
}
