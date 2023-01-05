import { AngoraResponseStatus } from './angora-response-status.model';

type BaseAngoraFetchHookData<TBody = unknown> = {
  body: TBody | null;
  error: Error | null;
  isFetching: boolean;
  isOK: boolean;
  status: AngoraResponseStatus | null;
};

type OKAngoraFetchHookData<TBody = unknown> = Omit<BaseAngoraFetchHookData<TBody>, 'body' | 'isOK'> & {
  body: TBody;
  isOK: true;
};

type NotOKAngoraFetchHookData<TBody = unknown> = Omit<BaseAngoraFetchHookData<TBody>, 'body' | 'isOK'> & {
  body: TBody | null;
  isOK: false;
};

export type AngoraFetchHookData<TBody = unknown> = OKAngoraFetchHookData<TBody> | NotOKAngoraFetchHookData<TBody>;
