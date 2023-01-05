import { AngoraData } from './angora-data.model';
import { AngoraFetchData } from './angora-fetch-data.models';

export type AngoraManifest<TFetchData extends AngoraFetchData = AngoraFetchData> = {
  [route: string]: AngoraData<TFetchData>;
};
