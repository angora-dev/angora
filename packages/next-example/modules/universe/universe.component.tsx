import { getFetchHooks } from '@angora/fetch';

import type { UniverseResponseBody } from './universe.models';

export const angora = {
  fetch: ['/api/universe'],
};

const [useUniverse] = getFetchHooks<[UniverseResponseBody]>(angora);

export function Universe() {
  const { body, error, isFetching, isOK, status } = useUniverse();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>{body.hello}</p>;
}
