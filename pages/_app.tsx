import '../styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import Script from 'next/script';
import { AudioContextProvider } from '../contexts/AudioContext';
import { OfflineStorageProvider } from '../contexts/OfflineStorageContext';
import { useEffect } from 'react';

export default function ERhythms({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-1.js', { type: 'module' });
    }
  });

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Spinnaker&display=swap"
          rel="stylesheet"
        />

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
