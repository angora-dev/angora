import { getFetchHooks } from '@angora/fetch';

import { Universe } from '../components/Universe';
import { World } from '../components/World';

export const angora = {
  fetch: [{ url: '/api/world' }, { url: '/api/universe' }],
};

const [useWorld, useUniverse] = getFetchHooks(angora);

export default function HomePage() {
  return (
    <>
      <World useWorld={useWorld} />
      <Universe useUniverse={useUniverse} />
    </>
  );
}
