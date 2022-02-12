import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AudioContextProvider } from '../contexts/AudioContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AudioContextProvider>
      <Component {...pageProps} />
    </AudioContextProvider>
  );
}

export default MyApp;
