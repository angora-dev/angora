import { AngoraData } from '../models/angora-data';
import { parseFetchData } from '../models/parse-fetch-data.utils';
import { getFetchHook } from '../react/get-fetch-hooks.utils';
import { NEXT_TRANSFORMERS } from './next.constants';

export function getFetchHooks(data: AngoraData) {
  return data.fetch.map((fetchData) => getFetchHook(parseFetchData(fetchData, NEXT_TRANSFORMERS)));
}
