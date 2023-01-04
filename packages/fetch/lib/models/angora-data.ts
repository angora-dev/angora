import { AngoraFetchData } from './angora-fetch-data';

export type AngoraData<TFetchData extends AngoraFetchData = AngoraFetchData> = {
  fetch: TFetchData[];
};
