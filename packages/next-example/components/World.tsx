import type { AngoraFetchHookData } from '@angora/fetch';

type ResponseData = { hello: string };

type WorldProps = {
  useWorld: () => AngoraFetchHookData<ResponseData>;
};

export function World({ useWorld }: WorldProps) {
  const { body, error, isFetching, isOK, status } = useWorld();

  return (
    <>
      {isFetching && <p>Loading...</p>}
      {Boolean(error) && <p>{error?.message}</p>}
      {!isOK && status !== null && <p>{status.text}</p>}
      {isOK && <p>{body.hello}</p>}
    </>
  );
}
