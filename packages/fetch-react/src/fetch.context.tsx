import {
  Context,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  DEFAULT_FETCH_OPTIONS,
  getFetchDataParser,
  getFetchDataUrl,
  getRandomUUID,
  ParsedAngoraFetchData,
} from '@angora/fetch-core';

import { AngoraFetchHook } from './models/angora-fetch-hook.model';
import { AngoraFetchInstance } from './models/angora-fetch-instance.model';
import { useStore } from './store/store.hook';
import { Subscribe, Unsubscribe } from './store/store.models';
import { createFetchHookData } from './utils/create-fetch-hook-data.util';
import { createFetchInstance } from './utils/create-fetch-instance.util';
import { unwrapResponse } from './utils/unwrap-response.util';

//#region Context
type AngoraFetchContextData<TBody = unknown> = {
  addFetchData: (uuid: string, fetchData: ParsedAngoraFetchData) => void;
  removeFetchData: (uuid: string) => void;
  subscribe: Subscribe<TBody>;
};

const AngoraFetchContext = createContext<AngoraFetchContextData | null>(null);
//#endregion Context

//#region Provider
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
      } finally {
        const newAbortControllers = new Map(abortControllersRef.current);
        newAbortControllers.delete(uuid);
        abortControllersRef.current = newAbortControllers;
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

//#endregion Provider

//#region Hook
function useAngoraFetch<TBody = unknown>() {
  const context = useContext(AngoraFetchContext as Context<AngoraFetchContextData<AngoraFetchInstance<TBody>>>);

  if (context === null) {
    throw new Error('`useAngoraFetch` must be used within an `AngoraFetchProvider`');
  }

  return context;
}
//#endregion Hook

//#region Utilities
export function getFetchHook<TParentBody = unknown>(fetchData: ParsedAngoraFetchData): AngoraFetchHook<TParentBody> {
  const uuid = getRandomUUID();

  function useFetch<TBody = TParentBody>() {
    const { addFetchData, subscribe } = useAngoraFetch<TBody>();
    const [data, setData] = useState(() => createFetchHookData<TBody>());
    const isSubscribed = useRef(false);

    useEffect(function handleSubscribe() {
      let unsubscribe: Unsubscribe | null = null;

      if (!isSubscribed.current) {
        addFetchData(uuid, fetchData);
        unsubscribe = subscribe(uuid, (data) => setData(data.hookData));
        isSubscribed.current = true;
      }

      return function handleUnsubscribe() {
        unsubscribe?.();
        isSubscribed.current = false;
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return data;
  }

  return useFetch;
}
//#endregion Utilities
