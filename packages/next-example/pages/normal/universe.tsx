import { getFetchHooks } from '@angora/fetch';

import { Universe } from '../../components/Universe';

const [useUniverse] = getFetchHooks({
  fetch: [{ url: '/api/universe' }],
});

export default function UniversePage() {
  return (
    <>
      <Universe useUniverse={useUniverse} />
    </>
  );
}
