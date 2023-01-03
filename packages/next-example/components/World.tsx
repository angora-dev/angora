import type { AngoraFetchHookData } from '@angora/fetch';

type ResponseData = { hello: string };

type WorldProps = {
  useWorld: () => AngoraFetchHookData<ResponseData>;
};

export function World({ useWorld }: WorldProps) {
  const { body, error, isFetching, isOK, status } = useWorld();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>{body.hello}</p>;
}
