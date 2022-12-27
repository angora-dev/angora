import { AngoraFetchHookData } from '@angora/fetch/react/fetch.models';

type ResponseData = { hello: string };

type UniverseProps = {
  useUniverse: () => AngoraFetchHookData<ResponseData>;
};

export function Universe({ useUniverse }: UniverseProps) {
  const { body, error, isFetching, isOK, status } = useUniverse();

  return (
    <>
      {isFetching && <p>Loading...</p>}
      {Boolean(error) && <p>{error?.message}</p>}
      {!isOK && status !== null && <p>{status.text}</p>}
      {isOK && <p>{body.hello}</p>}
    </>
  );
}
