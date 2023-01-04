import { getFetchHooks } from '@angora/fetch/next';

export const angora = {
  fetch: ['/api/greeting/optional/[[...names]]'],
};

type ResponseData = { names: string[] };

const [useGreeting] = getFetchHooks(angora);

export default function OptionalMultiGreetingPage() {
  const { body, error, isFetching, isOK, status } = useGreeting<ResponseData>();

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!isOK) return <p>{status?.text ?? 'Oops!'}</p>;

  let names = 'nobody';

  if (body.names.length > 0) {
    names = body.names.join(', ');
  }

  return <p>Hello, {names}!</p>;
}
