import type { AngoraFetchHookData } from '@angora/fetch';

import type { WorldResponseBody } from './world.models';

type WorldProps = {
  useWorld: () => AngoraFetchHookData<WorldResponseBody>;
};

export function World({ useWorld }: WorldProps) {
  const { body, error, isFetching, isOK, status } = useWorld();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>{body.hello}</p>;
}
