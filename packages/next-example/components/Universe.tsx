import type { AngoraFetchHookData } from '@angora/fetch';

type ResponseData = { hello: string };

type UniverseProps = {
  useUniverse: () => AngoraFetchHookData<ResponseData>;
};

export function Universe({ useUniverse }: UniverseProps) {
  const { body, error, isFetching, isOK, status } = useUniverse();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>{body.hello}</p>;
}
