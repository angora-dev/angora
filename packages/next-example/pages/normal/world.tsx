import { getFetchHooks } from '@angora/fetch/next';

import { World } from '../../components/World';

const [useWorld] = getFetchHooks({
  fetch: [{ url: '/api/world' }],
});

export default function WorldPage() {
  return <World useWorld={useWorld} />;
}
