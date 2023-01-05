import { getFetchHooks } from '@angora/fetch';

export const angora = {
  fetch: ['/api/greeting/[...names]'],
};

type MultiGreetingResponseBody = {
  names: string[];
};

const [useMultiGreeting] = getFetchHooks<[MultiGreetingResponseBody]>(angora);

export default function MultiGreetingPage() {
  const { body, error, isFetching, isOK, status } = useMultiGreeting();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>Hello, {body.names.join(', ')}!</p>;
}
