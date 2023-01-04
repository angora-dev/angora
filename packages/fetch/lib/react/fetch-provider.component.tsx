import { ReactNode, useCallback, useMemo, useRef } from 'react';

import { DEFAULT_FETCH_OPTIONS } from '../constants';
import { AngoraFetchData, ParsedAngoraFetchData } from '../models/angora-fetch-data';
import { getFetchDataUrl } from '../models/get-fetch-data-url.utils';
import { getFetchDataParser } from '../utils/router.utils';
import { AngoraFetchContext } from './fetch.context';
import { AngoraFetchInstance } from './fetch.models';
import { createFetchInstance, unwrapResponse } from './fetch.utils';
import { useStore } from './store.hook';

type AngoraFetchProviderProps = {
  children: ReactNode;
  urlPatternResult: URLPatternResult | null;
};

export function AngoraFetchProvider({ children, urlPatternResult }: AngoraFetchProviderProps) {
  const store = useStore<AngoraFetchInstance>();

  //#region Fetching data
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const angoraFetch = useCallback(
    async <TBody,>(uuid: string, fetchData: ParsedAngoraFetchData) => {
      if (abortControllersRef.current.has(uuid)) {
        return;
      }

      const abortController = new AbortController();
      const newAbortControllers = new Map(abortControllersRef.current);
      newAbortControllers.set(uuid, abortController);
      abortControllersRef.current = newAbortControllers;

      try {
        const fetchOptions: RequestInit = { ...DEFAULT_FETCH_OPTIONS, signal: abortController.signal };
        const parsedFetchData = getFetchDataParser(urlPatternResult)(fetchData);
        const url = getFetchDataUrl(parsedFetchData.url);
        const response = await fetch(url, fetchOptions);
        const body = await unwrapResponse<TBody>(response);

        store.update(uuid, (fetchInstance) => {
          fetchInstance.hookData.body = body;
          fetchInstance.hookData.error = null;
          fetchInstance.hookData.isFetching = false;
          fetchInstance.hookData.isOK = response.ok;
          fetchInstance.hookData.status = {
            code: response.status,
            text: response.statusText,
          };

          return fetchInstance;
        });
      } catch (error) {
        if (abortController.signal.aborted) {
          return;
        }

        store.update(uuid, (fetchInstance) => {
          fetchInstance.hookData.error = error as Error;
          fetchInstance.hookData.isFetching = false;
          fetchInstance.hookData.isOK = false;
          fetchInstance.hookData.status = null;

          return fetchInstance;
        });
      }
    },
    [urlPatternResult] // eslint-disable-line react-hooks/exhaustive-deps
  );
  //#endregion Fetching data

  //#region Fetch instances
  const addFetchData = useCallback(
    <TBody,>(uuid: string, fetchData: ParsedAngoraFetchData) => {
      store.add(uuid, createFetchInstance<TBody>(fetchData));
      angoraFetch<TBody>(uuid, fetchData);
    },
    [angoraFetch] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const removeFetchData = useCallback((uuid: string) => {
    store.remove(uuid);

    if (abortControllersRef.current.has(uuid)) {
      abortControllersRef.current.get(uuid)?.abort?.();

      const newAbortControllers = new Map(abortControllersRef.current);
      newAbortControllers.delete(uuid);
      abortControllersRef.current = newAbortControllers;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //#endregion Fetch instances

  const contextValue = useMemo(
    () => ({ addFetchData, removeFetchData, subscribe: store.subscribe }),
    [addFetchData, removeFetchData, store.subscribe]
  );

  return <AngoraFetchContext.Provider value={contextValue}>{children}</AngoraFetchContext.Provider>;
}
