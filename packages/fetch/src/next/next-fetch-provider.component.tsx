import { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';

import { AngoraFetchProvider } from '@angora/fetch-react';

import { transformNextRouteToURLPattern } from '../utils/transform-next-route-to-url-pattern.util';

type NextAngoraFetchProviderProps = {
  children: ReactNode;
};

export function NextAngoraFetchProvider({ children }: NextAngoraFetchProviderProps) {
  const router = useRouter();
  const patternResult = useMemo(() => {
    let currentPathname = router.asPath;

    if (currentPathname === router.pathname && typeof window !== 'undefined') {
      currentPathname = new URL(document.URL).pathname;
    }

    const pathname = transformNextRouteToURLPattern(router.pathname);
    const pattern = new URLPattern({ pathname });

    return pattern.exec({ pathname: currentPathname });
  }, [router.asPath, router.pathname]);

  return <AngoraFetchProvider urlPatternResult={patternResult}>{children}</AngoraFetchProvider>;
}
