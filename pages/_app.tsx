import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { AudioContextProvider } from '../contexts/AudioContext';
import { OfflineStorageProvider } from '../contexts/OfflineStorageContext';

export default function ERhythms({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>E-Drums</title>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content="A simple Euclidean rhythm generator"
        />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="viewport" content="width=device-width" />
      </Head>

      <AudioContextProvider>
        <OfflineStorageProvider>
          <Component {...pageProps} />
        </OfflineStorageProvider>
      </AudioContextProvider>

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-G88B8QTZ67"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-G88B8QTZ67');`,
        }}
      />
    </>
  );
}
