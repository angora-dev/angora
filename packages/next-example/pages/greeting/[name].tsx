import { getFetchHooks } from '@angora/fetch';

export const angora = {
  fetch: ['/api/greeting/[name]'],
};

type GreetingResponseBody = {
  name: string;
};

const [useGreeting] = getFetchHooks<[GreetingResponseBody]>(angora);

export default function GreetingPage() {
  const { body, error, isFetching, isOK, status } = useGreeting();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>Hello, {body.name}!</p>;
}
