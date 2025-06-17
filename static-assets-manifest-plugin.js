import fs from "fs";
import path from "path";
import crypto from "crypto";
import fg from "fast-glob";
import {
  STATIC_ASSETS_CONFIG,
  getCategory,
  isSupportedFileType,
} from "./static-assets-config.js";

function generateHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 8);
}

export function staticAssetsManifestPlugin() {
  return {
    name: "static-assets-manifest-plugin",
    apply: "build",
    enforce: "post", // important: to run after vite:manifest
    async writeBundle(options) {
      const outDir = options.dir || "dist";
      const manifestPath = path.join(outDir, ".vite", "manifest.json");

      if (!fs.existsSync(manifestPath)) {
        console.warn(
          `${STATIC_ASSETS_CONFIG.LOG_MESSAGES.PLUGIN_PREFIX} ${STATIC_ASSETS_CONFIG.ERROR_MESSAGES.MANIFEST_NOT_FOUND}`,
          manifestPath
        );
        return;
      }

      const raw = fs.readFileSync(manifestPath, "utf-8");
      const manifest = JSON.parse(raw);

      // Scan all files in src/assets/ recursively
      const sourceFiles = await fg("**/*", {
        cwd: STATIC_ASSETS_CONFIG.SOURCE_DIR,
        onlyFiles: true,
        absolute: true,
      });

      let processedCount = 0;

      for (const absFile of sourceFiles) {
        const ext = path.extname(absFile).toLowerCase();

        // Skip unknown file types
        if (!isSupportedFileType(ext)) {
          console.log(
            `${STATIC_ASSETS_CONFIG.LOG_MESSAGES.PLUGIN_PREFIX} Skipping unknown file type: ${absFile}`
          );
          continue;
        }

        const assetCategory = getCategory(ext);
        const buffer = fs.readFileSync(absFile);
        const hash = generateHash(buffer);
        const basename = path.basename(absFile, ext);
        const hashedFile = `${basename}.${hash}${ext}`;

        // Get relative path from source directory to preserve folder structure
        const relativeSourcePath = path.relative(
          STATIC_ASSETS_CONFIG.SOURCE_DIR,
          absFile
        );
        const relativeDir = path.dirname(relativeSourcePath);

        // Create manifest key (source path)
        const sourceManifestKey = path.posix
          .join(STATIC_ASSETS_CONFIG.SOURCE_DIR, relativeSourcePath)
          .replace(/\\/g, "/");

        // Create output path preserving directory structure
        const outputDir =
          relativeDir === "."
            ? STATIC_ASSETS_CONFIG.DIST_DIR
            : path.join(STATIC_ASSETS_CONFIG.DIST_DIR, relativeDir);
        const outputPath = path.join(outputDir, hashedFile);

        // Create manifest file path
        const manifestFilePath =
          relativeDir === "."
            ? `assets/${hashedFile}`
            : `assets/${relativeDir}/${hashedFile}`.replace(/\\/g, "/");

        // Create directory and copy file
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, buffer);

        // Create manifest entry with structure similar to other entries
        manifest[sourceManifestKey] = {
          file: manifestFilePath,
          src: sourceManifestKey,
          name: basename,
          isAsset: true,
          type: assetCategory,
          size: buffer.length, // Add file size for reference
        };

        processedCount++;
      }

      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log(
        `${STATIC_ASSETS_CONFIG.LOG_MESSAGES.PLUGIN_PREFIX} manifest.json extended with ${processedCount} static assets`
      );
    },
  };
}
