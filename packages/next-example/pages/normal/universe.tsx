import { getFetchHooks } from '@angora/fetch/next';

import { Universe } from '../../modules/universe/universe.component';
import type { UniverseResponseBody } from '../../modules/universe/universe.models';

const [useUniverse] = getFetchHooks<[UniverseResponseBody]>({
  fetch: [{ url: '/api/universe' }],
});

export default function UniversePage() {
  return <Universe useUniverse={useUniverse} />;
}
