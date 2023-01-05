import { AngoraFetchData } from '../models/angora-fetch-data.models';
import { isString } from './is-string.util';

export function getFetchDataUrl(fetchData: AngoraFetchData) {
  if (isString(fetchData)) {
    return fetchData;
  }

  return fetchData.url;
}
