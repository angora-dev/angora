import type { AppProps } from 'next/app';

import { NextAngoraFetchProvider } from '@angora/fetch';

import Layout from './layout';

import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextAngoraFetchProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </NextAngoraFetchProvider>
  );
}
