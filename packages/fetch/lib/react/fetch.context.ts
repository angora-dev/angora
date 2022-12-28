import { createContext } from 'react';

import { AngoraFetchData } from '../models/angora-fetch-data';
import { AngoraFetchContextData } from './fetch.models';
import { createFetchInstance } from './fetch.utils';

export const AngoraFetchContext = createContext<AngoraFetchContextData>({
  addFetchData: (_uuid: string, _fetchData: AngoraFetchData) => null,
  removeFetchData: (_uuid: string) => null,
  getFetchInstance: <T = unknown>(_uuid: string, fetchData: AngoraFetchData) => createFetchInstance<T>(fetchData),
});
