import { AngoraData, AngoraFetchData, parseFetchData } from '@angora/fetch-core';
import { AngoraFetchHooks, getFetchHook } from '@angora/fetch-react';

import { NEXT_TRANSFORMERS } from '../constants';

export function getFetchHooks<TBodyArray extends ReadonlyArray<unknown> = unknown[]>(
  data: AngoraData<AngoraFetchData, TBodyArray>
): AngoraFetchHooks<TBodyArray> {
  return data.fetch.map((fetchData) =>
    getFetchHook(parseFetchData(fetchData, NEXT_TRANSFORMERS))
  ) as AngoraFetchHooks<TBodyArray>;
}
