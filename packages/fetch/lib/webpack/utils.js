const { readFile } = require('fs/promises');

// Identify /[param]/ in route string
const TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;

function isDynamicRoute(route) {
  return TEST_ROUTE.test(route);
}

// "asset path" being its javascript file, data file, prerendered html,...
function getRouteFromAssetPath(assetPath, ext = '') {
  assetPath = assetPath.replace(/\\/g, '/');
  assetPath = ext && assetPath.endsWith(ext) ? assetPath.slice(0, -ext.length) : assetPath;

  if (assetPath.startsWith('/index/') && !isDynamicRoute(assetPath)) {
    assetPath = assetPath.slice(6);
  } else if (assetPath === '/index') {
    assetPath = '/';
  }

  return assetPath;
}

function matchBundle(regex, input) {
  const result = regex.exec(input);

  if (!result) {
    return null;
  }

  return getRouteFromAssetPath(`/${result[1]}`);
}

// matches app/:path*.js
const APP_ROUTE_NAME_REGEX = /^app[/\\](.*)$/;

function getAppRouteFromEntrypoint(entryFile) {
  const pagePath = matchBundle(APP_ROUTE_NAME_REGEX, entryFile);

  if (typeof pagePath === 'string' && !pagePath) {
    return '/';
  }

  if (!pagePath) {
    return null;
  }

  return pagePath;
}

// matches pages/:page*.js
const SERVER_ROUTE_NAME_REGEX = /^pages[/\\](.*)$/;

// matches static/pages/:page*.js
const BROWSER_ROUTE_NAME_REGEX = /^static[/\\]pages[/\\](.*)$/;

module.exports.getRouteFromEntrypoint = function getRouteFromEntrypoint(entryFile, app) {
  let pagePath = matchBundle(SERVER_ROUTE_NAME_REGEX, entryFile);

  if (pagePath) {
    return pagePath;
  }

  if (app) {
    pagePath = getAppRouteFromEntrypoint(entryFile);
    if (pagePath) return pagePath;
  }

  // Potentially the passed item is a browser bundle so we try to match that also
  return matchBundle(BROWSER_ROUTE_NAME_REGEX, entryFile);
};

/**
 * For a given page path, this function ensures that there is no backslash
 * escaping slashes in the path. Example:
 *  - `foo\/bar\/baz` -> `foo/bar/baz`
 */
module.exports.normalizePathSep = function normalizePathSep(path) {
  return path.replace(/\\/g, '/');
};

const { createHash } = require('crypto');
const LRUCache = require('next/dist/compiled/lru-cache');
const { withPromiseCache } = require('next/dist/lib/with-promise-cache');
const { parse } = require('next/dist/build/swc');

/**
 * Parses a module with SWC using an LRU cache where the parsed module will
 * be indexed by a sha of its content holding up to 500 entries.
 */
module.exports.parseModule = withPromiseCache(
  new LRUCache({ max: 500 }),
  async (filename, content) => parse(content, { isModule: 'unknown', filename }).catch(() => null),
  (_, content) => createHash('sha1').update(content).digest('hex')
);
