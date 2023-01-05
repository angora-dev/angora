import { AngoraData } from '../models/angora-data';
import { AngoraFetchData } from '../models/angora-fetch-data';
import { parseFetchData } from '../models/parse-fetch-data.utils';
import { AngoraFetchHooks } from '../react/fetch.models';
import { getFetchHook } from '../react/get-fetch-hooks.utils';
import { NEXT_TRANSFORMERS } from './next.constants';

export function getFetchHooks<TBodyArray extends ReadonlyArray<unknown> = unknown[]>(
  data: AngoraData<AngoraFetchData, TBodyArray>
): AngoraFetchHooks<TBodyArray> {
  return data.fetch.map((fetchData) =>
    getFetchHook(parseFetchData(fetchData, NEXT_TRANSFORMERS))
  ) as AngoraFetchHooks<TBodyArray>;
}
