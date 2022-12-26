const webpack = require('webpack');

const { getRouteFromEntrypoint, parseModule, normalizePathSep } = require('./utils');
const { ANGORA_MANIFEST, IGNORED_FILES } = require('./constants');
const { sources } = require('webpack');
const { extractExportedConstValue, UnsupportedValueError } = require('./extract-const-value.util');
const Log = require('next/dist/build/output/log'); //'../output/log'

let edgeServerPages = {};
let nodeServerPages = {};

class AngoraFetchPlugin {
  constructor({ dev, isEdgeRuntime, appDirEnabled }) {
    this.dev = dev;
    this.isEdgeRuntime = isEdgeRuntime;
    this.appDirEnabled = appDirEnabled;
  }

  async createAssets(compilation, assets) {
    // STEP 1: Get pageFilePath paths.
    const entrypoints = compilation.entrypoints;
    const pages = {};

    for (const entrypoint of entrypoints.values()) {
      const pagePath = getRouteFromEntrypoint(entrypoint.name, this.appDirEnabled);

      if (!pagePath) {
        continue;
      }

      const files = entrypoint
        .getFiles()
        .filter(
          (pageFilePath) =>
            !IGNORED_FILES.some((ignoredFile) => pageFilePath.includes(ignoredFile)) && pageFilePath.endsWith('.js')
        );

      if (!files.length) {
        continue;
      }

      // Write filename, replace any backslashes in path (on windows) with forwardslashes for cross-platform consistency.
      let pageFilePath = files[files.length - 1];

      if (!this.dev) {
        if (!this.isEdgeRuntime) {
          pageFilePath = pageFilePath.slice(3);
        }
      }

      pageFilePath = normalizePathSep(pageFilePath);

      // STEP 2: Get source code.
      // CASE 2.1: Handle Node.js Runtime for `pages` folder.
      const chunk = entrypoint.chunks.find((chunk) => chunk.id === entrypoint.name);
      const modules = [...compilation.chunkGraph.getChunkEntryModulesIterable(chunk)];
      const entryModule = modules?.[0];
      const sourceMapSource = entryModule?.originalSource?.();
      const source = sourceMapSource?.source?.() ?? '';

      // CASE 2.2: Handle Edge Runtime for `pages` folder.
      // TODO

      // CASE 2.3: Handle Node.js Runtime for `app` folder.
      // TODO

      // CASE 2.4: Handle Edge Runtime for `app` folder.
      // TODO

      // STEP 3: Get `angora` config object.
      if (!/export const angora/.test(source)) {
        continue;
      }

      const swcAST = await parseModule(pageFilePath, source);

      let angoraConfig = null;
      try {
        angoraConfig = extractExportedConstValue(swcAST, 'angora');
      } catch (error) {
        if (error instanceof UnsupportedValueError) {
          Log.warn(
            `Angora can't recognize the exported \`angora\` field in "${pageFilePath}:\n"` +
              error.message +
              (error.path ? ` at "${error.path}"` : '')
          );
        }

        // `export angora` doesn't exist, or other unknown error throw by swc, silence them
      }

      if (!angoraConfig) {
        continue;
      }

      pages[pagePath] = angoraConfig;
    }

    // This plugin is used by both the Node server and Edge server compilers,
    // we need to merge both pages to generate the full manifest.
    if (this.isEdgeRuntime) {
      edgeServerPages = pages;
    } else {
      nodeServerPages = pages;
    }

    const allPages = { ...edgeServerPages, ...nodeServerPages };

    assets[`${!this.dev && !this.isEdgeRuntime ? '../' : ''}` + ANGORA_MANIFEST] = new sources.RawSource(
      JSON.stringify(allPages, null, 2)
    );
  }

  apply(compiler) {
    compiler.hooks.make.tap('AngoraFetch', (compilation) => {
      compilation.hooks.processAssets.tapPromise(
        {
          name: 'AngoraFetch',
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          return this.createAssets(compilation, assets);
        }
      );
    });
  }
}

module.exports = AngoraFetchPlugin;
