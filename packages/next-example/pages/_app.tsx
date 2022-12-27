import type { AppProps } from 'next/app';

import { AngoraFetchProvider } from '@angora/fetch';

import Layout from './layout';

import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AngoraFetchProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AngoraFetchProvider>
  );
}
