import { AngoraFetchData, ParsedAngoraFetchData, ShortAngoraFetchData } from './angora-fetch-data.models';

export type AngoraData<
  TFetchData extends AngoraFetchData = AngoraFetchData,
  TFetchBodyArray extends ReadonlyArray<unknown> = unknown[]
> = {
  fetch:
    | {
        [K in keyof TFetchBodyArray]: TFetchData extends ParsedAngoraFetchData
          ? ParsedAngoraFetchData<TFetchBodyArray[K]>
          : TFetchData extends ShortAngoraFetchData
          ? ShortAngoraFetchData<TFetchData>
          : AngoraFetchData<TFetchBodyArray[K]>;
      }
    | TFetchData[];
};
