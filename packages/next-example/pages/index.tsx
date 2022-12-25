import Head from 'next/head';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Example Next.js using Angora</title>
        <meta name="description" content="Example Next.js using Angora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles['main']}>
        <h1>Example Next.js using Angora</h1>
      </main>
    </>
  );
}
