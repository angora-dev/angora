import { Context, useContext, useEffect, useRef, useState } from 'react';

import { AngoraData } from '../models/angora-data';
import { AngoraFetchData } from '../models/angora-fetch-data';
import { getRandomUUID } from '../utils/crypto.utils';
import { AngoraFetchContext } from './fetch.context';
import { AngoraFetchContextData, AngoraFetchInstance } from './fetch.models';
import { createFetchHookData } from './fetch.utils';

export function getFetchHooks(data: AngoraData) {
  return data.fetch.map((fetchData) => getFetchHook(fetchData));
}

export function getFetchHook(fetchData: AngoraFetchData) {
  const uuid = getRandomUUID();

  function useFetch<T = unknown>() {
    const { addFetchData, removeFetchData, subscribe } = useContext<AngoraFetchContextData<AngoraFetchInstance<T>>>(
      AngoraFetchContext as Context<AngoraFetchContextData<AngoraFetchInstance<T>>>
    );
    const setTimeoutRef = useRef<number | NodeJS.Timeout | undefined>();
    const [data, setData] = useState(() => createFetchHookData<T>());

    useEffect(function handleAddFetchData() {
      let unsubscribe = null;

      if (setTimeoutRef.current) {
        clearTimeout(setTimeoutRef.current);
        setTimeoutRef.current = undefined;
      } else {
        addFetchData(uuid, fetchData);
        unsubscribe = subscribe(uuid, (data) => setData(data.hookData));
      }

      return function handleRemoveFetchData() {
        setTimeoutRef.current = setTimeout(() => {
          removeFetchData(uuid);
        }, 0);
      };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return data;
  }

  return useFetch;
}
