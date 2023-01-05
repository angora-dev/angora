import { getFetchHooks } from '@angora/fetch';

import type { WorldResponseBody } from './world.models';

export const angora = {
  fetch: ['/api/world'],
};

const [useWorld] = getFetchHooks<[WorldResponseBody]>(angora);

export function World() {
  const { body, error, isFetching, isOK, status } = useWorld();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>{body.hello}</p>;
}
