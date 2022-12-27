import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';

import { AngoraFetchData } from '../models/angora-fetch-data';
import { AngoraFetchContext } from './fetch.context';
import { AngoraFetchHookData, AngoraFetchInstance, AngoraFetchInstanceMap } from './fetch.models';
import { createFetchInstance, unwrapResponse } from './fetch.utils';

type AngoraFetchProviderProps = {
  children: ReactNode;
};

export function AngoraFetchProvider({ children }: AngoraFetchProviderProps) {
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());
  const fetchInstancesRef = useRef<AngoraFetchInstanceMap>(new Map());
  const [fetchInstances, setFetchInstances] = useState<AngoraFetchInstanceMap>(() => new Map());

  //#region Fetching data
  const updateHookData = useCallback(
    <T,>(uuid: string, updateCallback: (hookData: AngoraFetchHookData<T>) => AngoraFetchHookData<T>) => {
      const fetchInstance = fetchInstancesRef.current.get(uuid);

      if (!fetchInstance) {
        return;
      }

      const updatedFetchInstance = structuredClone(fetchInstance as AngoraFetchInstance<T>);
      updatedFetchInstance.hookData = updateCallback(updatedFetchInstance.hookData);

      const newFetchInstances = structuredClone(fetchInstancesRef.current);
      newFetchInstances.set(uuid, updatedFetchInstance);

      setFetchInstances(newFetchInstances);
      fetchInstancesRef.current = newFetchInstances;
    },
    []
  );

  const angoraFetch = useCallback(async <T,>(uuid: string, fetchData: AngoraFetchData) => {
    if (abortControllersRef.current.has(uuid)) {
      return;
    }

    const abortController = new AbortController();
    const newAbortControllers = new Map(abortControllersRef.current);
    newAbortControllers.set(uuid, abortController);
    abortControllersRef.current = newAbortControllers;

    try {
      const response = await fetch(fetchData.url, { signal: abortController.signal });
      const body = await unwrapResponse<T>(response);

      updateHookData<T>(uuid, (hookData) => {
        hookData.body = body;
        hookData.error = null;
        hookData.isFetching = false;
        hookData.isOK = response.ok;
        hookData.status = {
          code: response.status,
          text: response.statusText,
        };

        return hookData;
      });
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }

      updateHookData<T>(uuid, (hookData) => {
        hookData.error = error as Error;
        hookData.isFetching = false;
        hookData.isOK = false;
        hookData.status = null;

        return hookData;
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  //#endregion Fetching data

  //#region Fetch instances
  const addFetchData = useCallback(<T,>(uuid: string, fetchData: AngoraFetchData) => {
    const newFetchInstance = createFetchInstance<T>(fetchData);
    const newFetchInstances = structuredClone(fetchInstancesRef.current);
    newFetchInstances.set(uuid, newFetchInstance);

    fetchInstancesRef.current = newFetchInstances;
    angoraFetch<T>(uuid, fetchData);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const removeFetchData = useCallback((uuid: string) => {
    const newFetchInstances = structuredClone(fetchInstancesRef.current);
    newFetchInstances.delete(uuid);

    fetchInstancesRef.current = newFetchInstances;
    setFetchInstances((prevFetchInstances) => {
      if (prevFetchInstances.has(uuid)) {
        return newFetchInstances;
      }

      return prevFetchInstances;
    });

    if (abortControllersRef.current.has(uuid)) {
      abortControllersRef.current.get(uuid)?.abort?.();

      const newAbortControllers = new Map(abortControllersRef.current);
      newAbortControllers.delete(uuid);
      abortControllersRef.current = newAbortControllers;
    }
  }, []);

  const getFetchInstance = useCallback(
    <T,>(uuid: string, fetchData: AngoraFetchData) => {
      const instance = fetchInstances.get(uuid) as AngoraFetchInstance<T> | undefined;

      if (instance) {
        return instance;
      }

      const refInstance = fetchInstancesRef.current.get(uuid) as AngoraFetchInstance<T> | undefined;

      if (refInstance) {
        return refInstance;
      }

      return createFetchInstance<T>(fetchData);
    },
    [fetchInstances]
  );
  //#endregion Fetch instances

  const contextValue = useMemo(
    () => ({ addFetchData, removeFetchData, getFetchInstance }),
    [addFetchData, removeFetchData, getFetchInstance]
  );

  return <AngoraFetchContext.Provider value={contextValue}>{children}</AngoraFetchContext.Provider>;
}
