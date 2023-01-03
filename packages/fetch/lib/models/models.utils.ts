import { isString } from '../utils/string.utils';
import { AngoraFetchData } from './angora-fetch-data';

export function getFetchDataUrl(fetchData: AngoraFetchData) {
  if (isString(fetchData)) {
    return fetchData;
  }

  return fetchData.url;
}
