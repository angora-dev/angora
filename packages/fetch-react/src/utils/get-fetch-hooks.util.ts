import { AngoraData, ParsedAngoraFetchData } from '@angora/fetch-core';

import { getFetchHook } from '../fetch.context';
import { AngoraFetchHooks } from '../models/angora-fetch-hooks.model';

export function getFetchHooks<TBodyArray extends ReadonlyArray<unknown> = unknown[]>(
  data: AngoraData<ParsedAngoraFetchData, TBodyArray>
): AngoraFetchHooks<TBodyArray> {
  return data.fetch.map((fetchData) => getFetchHook(fetchData)) as AngoraFetchHooks<TBodyArray>;
}
