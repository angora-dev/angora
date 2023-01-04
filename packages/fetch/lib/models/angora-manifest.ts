import { AngoraData } from './angora-data';
import { AngoraFetchData } from './angora-fetch-data';

export type AngoraManifest<TFetchData extends AngoraFetchData = AngoraFetchData> = {
  [route: string]: AngoraData<TFetchData>;
};
