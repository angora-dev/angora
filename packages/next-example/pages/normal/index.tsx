import { getFetchHooks } from '@angora/fetch/next';

import { Universe } from '../../modules/universe/universe.component';
import type { UniverseResponseBody } from '../../modules/universe/universe.models';
import { World } from '../../modules/world/world.component';
import type { WorldResponseBody } from '../../modules/world/world.models';

const [useWorld, useUniverse] = getFetchHooks<[WorldResponseBody, UniverseResponseBody]>({
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
