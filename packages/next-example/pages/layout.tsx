import { ReactNode } from 'react';
import Head from 'next/head';

import styles from '../styles/Layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Example Next.js using Angora</title>
        <meta name="description" content="Example Next.js using Angora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles['main']}>{children}</main>
    </>
  );
}
