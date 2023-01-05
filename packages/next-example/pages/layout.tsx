import { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from '../styles/Layout.module.css';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Example Next.js using Angora</title>
        <meta name="description" content="Example Next.js using Angora" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/x-icon;," type="image/x-icon" />
      </Head>
      <main className={styles['main']}>
        <h1>Example Next.js using Angora!</h1>

        <menu className={styles['menu']}>
          <Link
            href="/"
            prefetch={false}
            title="2 requests: /api/world and /api/universe"
            className={router.pathname === '/' ? styles['menu-item--active'] : ''}
          >
            Home
          </Link>
          <Link
            href="/world"
            prefetch={false}
            title="1 request: /api/world"
            className={router.pathname === '/world' ? styles['menu-item--active'] : ''}
          >
            World
          </Link>
          <Link
            href="/universe"
            prefetch={false}
            title="1 request: /api/universe"
            className={router.pathname === '/universe' ? styles['menu-item--active'] : ''}
          >
            Universe
          </Link>
        </menu>
        {children}
      </main>
    </>
  );
}
