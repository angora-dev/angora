import { useContext, useEffect, useMemo } from 'react';

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

    useEffect(function handleAddFetchData() {
      addFetchData(uuid, internalFetchData);

      return function handleRemoveFetchData() {
        removeFetchData(uuid);
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return fetchInstance.hookData;
  }

  return useFetch;
}
