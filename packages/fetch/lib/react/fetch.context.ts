import { createContext } from 'react';

import { AngoraFetchContextData } from './fetch.models';

export const AngoraFetchContext = createContext<AngoraFetchContextData>({
  addFetchData: (_uuid, _fetchData) => null,
  removeFetchData: (_uuid) => null,
  subscribe: (_uuid, _callback) => () => null,
});
