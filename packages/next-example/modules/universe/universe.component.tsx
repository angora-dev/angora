import type { AngoraFetchHookData } from '@angora/fetch';

import type { UniverseResponseBody } from './universe.models';

type UniverseProps = {
  useUniverse: () => AngoraFetchHookData<UniverseResponseBody>;
};

export function Universe({ useUniverse }: UniverseProps) {
  const { body, error, isFetching, isOK, status } = useUniverse();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>{body.hello}</p>;
}
