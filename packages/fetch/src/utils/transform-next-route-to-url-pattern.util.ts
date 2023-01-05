import { getRouteRegex } from 'next/dist/shared/lib/router/utils/route-regex';

/**
 * Transforms Next.js route path to standard URL Pattern string.
 *
 * Examples:
 *   - `[[...slug]]` -> `:slug*` (repeating optional group)
 *   - `[...slug]` -> `:slug+` (repeating group, minimum one match)
 *   - `[foo]` -> `:slug` (required group)
 *   - `bar` -> `bar`
 *
 * @param nextRoute Next.js route path
 * @returns Standard URL Pattern string
 */
export function transformNextRouteToURLPattern(nextRoute: string) {
  const routeRegex = getRouteRegex(nextRoute);
  let urlPattern = nextRoute;

  for (const [groupName, data] of Object.entries(routeRegex.groups)) {
    if (!data.optional && !data.repeat) {
      urlPattern = urlPattern.replace(`[${groupName}]`, `:${groupName}`);
      continue;
    }

    if (!data.optional && data.repeat) {
      urlPattern = urlPattern.replace(`[...${groupName}]`, `:${groupName}+`);
      continue;
    }

    if (data.optional && data.repeat) {
      urlPattern = urlPattern.replace(`[[...${groupName}]]`, `:${groupName}*`);
      continue;
    }
  }

  return urlPattern;
}
