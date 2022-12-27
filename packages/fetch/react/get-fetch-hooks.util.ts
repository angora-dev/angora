import { useContext, useEffect, useMemo, useRef } from 'react';

import { AngoraData } from '../models/angora-data';
import { AngoraFetchData } from '../models/angora-fetch-data';
import { getRandomUUID } from '../utils/crypto.util';
import { AngoraFetchContext } from './fetch.context';

export function getFetchHooks(data: AngoraData) {
  return data.fetch.map((fetchData) => getFetchHook(fetchData));
}

export function getFetchHook(fetchData: AngoraFetchData) {
  const uuid = getRandomUUID();

  function useFetch<T = unknown>() {
    const internalFetchData = useMemo(() => fetchData, []);
    const { addFetchData, removeFetchData, getFetchInstance } = useContext(AngoraFetchContext);
    const fetchInstance = useMemo(() => getFetchInstance<T>(uuid, fetchData), [getFetchInstance]);
    const setTimeoutRef = useRef<number | NodeJS.Timeout | undefined>();

    useEffect(function handleAddFetchData() {
      if (setTimeoutRef.current) {
        clearTimeout(setTimeoutRef.current);
        setTimeoutRef.current = undefined;
      } else {
        addFetchData(uuid, internalFetchData);
      }

      return function handleRemoveFetchData() {
        setTimeoutRef.current = setTimeout(() => {
          removeFetchData(uuid);
        }, 0);
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return fetchInstance.hookData;
  }

  return useFetch;
}
