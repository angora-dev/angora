import { extractExportedConstValue, UnsupportedValueError } from 'next/dist/build/analysis/extract-const-value';
import { parseModule } from 'next/dist/build/analysis/parse-module';
import Log from 'next/dist/build/output/log';
import getRouteFromEntrypoint from 'next/dist/server/get-route-from-entrypoint';
import { normalizePathSep } from 'next/dist/shared/lib/page-path/normalize-path-sep';
import type { Compilation, Compiler } from 'webpack';
import webpack from 'webpack';

import { ANGORA_MANIFEST_FILE_NAME } from '../constants';
import { AngoraManifest } from '../models/angora-manifest';
import { IGNORED_ENTRYPOINT_FILES } from './next.constants';

let edgeServerPages = {};
let nodeServerPages = {};

export class AngoraFetchPlugin {
  protected dev: boolean;
  protected isEdgeRuntime: boolean;
  protected appDirEnabled: boolean;

  constructor({ dev, isEdgeRuntime, appDirEnabled }: { dev: boolean; isEdgeRuntime: boolean; appDirEnabled: boolean }) {
    this.dev = dev;
    this.isEdgeRuntime = isEdgeRuntime;
    this.appDirEnabled = appDirEnabled;
  }

  async createAssets(compilation: Compilation, assets: Compilation['assets']) {
    // STEP 1: Get pageFilePath paths.
    const entrypoints = compilation.entrypoints;
    const pages: AngoraManifest = {};

    for (const entrypoint of entrypoints.values()) {
      const pagePath = getRouteFromEntrypoint(entrypoint.name as string, this.appDirEnabled);

      if (!pagePath) {
        continue;
      }

      const files = entrypoint
        .getFiles()
        .filter(
          (pageFilePath) =>
            !IGNORED_ENTRYPOINT_FILES.some((ignoredFile) => pageFilePath.includes(ignoredFile)) &&
            pageFilePath.endsWith('.js')
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
      let source = '';

      // @ts-expect-error
      const modules = entrypoint._modulePostOrderIndices.keys(); // TODO: Find a better way of gettings modules

      for (const currentModule of modules) {
        const currentSource = currentModule.originalSource()?.source?.();

        if (currentSource) {
          source = `${source}\n${currentSource}`;
        }
      }

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

    assets[`${!this.dev && !this.isEdgeRuntime ? '../' : ''}../../public/` + ANGORA_MANIFEST_FILE_NAME] =
      new webpack.sources.RawSource(JSON.stringify(allPages, null, 2));
  }

  apply(compiler: Compiler) {
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
