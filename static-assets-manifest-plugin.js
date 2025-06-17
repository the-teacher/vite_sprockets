import path from "path";
import {
  scanSourceFiles,
  processAssetFile,
  processManifest,
  writeManifest,
} from "./static-assets-utils.js";
import { STATIC_ASSETS_CONFIG } from "./static-assets-config.js";

export function staticAssetsManifestPlugin() {
  return {
    name: "static-assets-manifest-plugin",
    apply: "build",
    enforce: "post", // important: to run after vite:manifest
    async writeBundle(options) {
      const outDir = options.dir || STATIC_ASSETS_CONFIG.DIST_DIR;
      const manifestPath = path.join(
        outDir,
        STATIC_ASSETS_CONFIG.MANIFEST_PATH
      );

      // Read and process manifest
      const manifest = processManifest(manifestPath);
      if (!manifest) return;

      // Process all static assets
      const sourceFiles = await scanSourceFiles();
      let processedCount = 0;

      for (const absFile of sourceFiles) {
        const result = processAssetFile(absFile);
        if (result) {
          manifest[result.sourceManifestKey] = result.manifestEntry;
          processedCount++;
        }
      }

      // Save updated manifest
      writeManifest(manifestPath, manifest, processedCount);
    },
  };
}
