import { getFetchHooks } from '@angora/fetch';

import { Universe } from '../../components/Universe';
import { World } from '../../components/World';

const [useWorld, useUniverse] = getFetchHooks({
  fetch: [{ url: '/api/world' }, { url: '/api/universe' }],
});

export default function HomePage() {
  return (
    <>
      <World useWorld={useWorld} />
      <Universe useUniverse={useUniverse} />
    </>
  );
}
