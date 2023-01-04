import { getFetchHooks } from '@angora/fetch/next';

export const angora = {
  fetch: ['/api/greeting/[...names]'],
};

type ResponseData = { names: string[] };

const [useGreeting] = getFetchHooks(angora);

export default function MultiGreetingPage() {
  const { body, error, isFetching, isOK, status } = useGreeting<ResponseData>();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  return <p>Hello, {body.names.join(', ')}!</p>;
}
