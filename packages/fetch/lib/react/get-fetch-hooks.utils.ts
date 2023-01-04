import { Context, useContext, useEffect, useRef, useState } from 'react';

import { AngoraData } from '../models/angora-data';
import { ParsedAngoraFetchData } from '../models/angora-fetch-data';
import { getRandomUUID } from '../utils/crypto.utils';
import { AngoraFetchContext } from './fetch.context';
import { AngoraFetchContextData, AngoraFetchInstance } from './fetch.models';
import { createFetchHookData } from './fetch.utils';

export function getFetchHooks(data: AngoraData<ParsedAngoraFetchData>) {
  return data.fetch.map((fetchData) => getFetchHook(fetchData));
}

export function getFetchHook(fetchData: ParsedAngoraFetchData) {
  const uuid = getRandomUUID();

  function useFetch<TBody = unknown>() {
    const { addFetchData, removeFetchData, subscribe } = useContext<AngoraFetchContextData<AngoraFetchInstance<TBody>>>(
      AngoraFetchContext as Context<AngoraFetchContextData<AngoraFetchInstance<TBody>>>
    );
    const setTimeoutRef = useRef<number | NodeJS.Timeout | undefined>();
    const [data, setData] = useState(() => createFetchHookData<TBody>());

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
