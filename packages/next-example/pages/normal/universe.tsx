import { getFetchHooks } from '@angora/fetch/next';

import { Universe } from '../../components/Universe';

const [useUniverse] = getFetchHooks({
  fetch: [{ url: '/api/universe' }],
});

export default function UniversePage() {
  return <Universe useUniverse={useUniverse} />;
}
