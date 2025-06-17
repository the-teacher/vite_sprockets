import fs from "fs";
import path from "path";
import crypto from "crypto";
import fg from "fast-glob";
import {
  STATIC_ASSETS_CONFIG,
  isSupportedFileType,
  getCategory,
} from "./static-assets-config.js";

/**
 * Assets logging function (only works in development)
 */
export function assetsLog(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
}

/**
 * Generates a hash for the given buffer
 */
function generateHash(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 8);
}

/**
 * Generates all necessary paths for an asset file
 *
 * Example for file: src/assets/images/logo.png
 * With config:
 *   SOURCE_DIR: "src"
 *   DIST_DIR: "dist"
 *   ASSETS_DIR: "assets"
 *
 * Computed paths:
 *   SOURCE_ASSETS_DIR: "src/assets"
 *   DIST_ASSETS_DIR: "dist/assets"
 *
 * Returns:
 *   sourceManifestKey: "src/assets/images/logo.png"      // Original path as key in manifest
 *   outputPath: "dist/assets/images/logo.{hash}.png"     // Where file will be written
 *   manifestFilePath: "assets/images/logo.{hash}.png"    // Public path in manifest
 *
 * For root file src/assets/favicon.ico:
 *   sourceManifestKey: "src/assets/favicon.ico"
 *   outputPath: "dist/assets/favicon.{hash}.ico"
 *   manifestFilePath: "assets/favicon.{hash}.ico"
 */
function getAssetPaths(absFile, hashedFile) {
  const relativeSourcePath = path.relative(
    STATIC_ASSETS_CONFIG.SOURCE_ASSETS_DIR,
    absFile
  );
  const relativeDir = path.dirname(relativeSourcePath);

  return {
    // Original file path as key in manifest (e.g. "src/assets/images/logo.png")
    sourceManifestKey: path.posix
      .join(STATIC_ASSETS_CONFIG.SOURCE_ASSETS_DIR, relativeSourcePath)
      .replace(/\\/g, "/"),

    // Physical output path where file will be written
    // e.g. "dist/assets/images/logo.{hash}.png"
    outputPath: path.join(
      relativeDir === "."
        ? STATIC_ASSETS_CONFIG.DIST_ASSETS_DIR
        : path.join(STATIC_ASSETS_CONFIG.DIST_ASSETS_DIR, relativeDir),
      hashedFile
    ),

    // Public path used in manifest
    // e.g. "assets/images/logo.{hash}.png"
    manifestFilePath: (relativeDir === "."
      ? `${STATIC_ASSETS_CONFIG.ASSETS_DIR}/${hashedFile}`
      : `${STATIC_ASSETS_CONFIG.ASSETS_DIR}/${relativeDir}/${hashedFile}`
    ).replace(/\\/g, "/"),
  };
}

function writeAssetFile(outputPath, buffer) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
}

/**
 * Reads file and creates basic file info (buffer, hash, filename parts)
 */
function createFileInfo(absFile) {
  const buffer = fs.readFileSync(absFile);
  const hash = generateHash(buffer);
  const ext = path.extname(absFile).toLowerCase();
  const basename = path.basename(absFile, ext);
  const hashedFile = `${basename}.${hash}${ext}`;

  return { buffer, hash, ext, basename, hashedFile };
}

/**
 * Scans source directory for static assets
 */
export async function scanSourceFiles() {
  return fg("**/*", {
    cwd: STATIC_ASSETS_CONFIG.SOURCE_ASSETS_DIR,
    onlyFiles: true,
    absolute: true,
  });
}

/**
 * Processes a single static asset file and returns manifest entry
 */
export function processAssetFile(absFile) {
  const ext = path.extname(absFile).toLowerCase();

  if (!isSupportedFileType(ext)) {
    assetsLog(
      `${STATIC_ASSETS_CONFIG.LOG_MESSAGES.PLUGIN_PREFIX} Skipping unknown file type: ${absFile}`
    );
    return null;
  }

  const { buffer, basename, hashedFile } = createFileInfo(absFile);

  const { sourceManifestKey, outputPath, manifestFilePath } = getAssetPaths(
    absFile,
    hashedFile
  );

  writeAssetFile(outputPath, buffer);

  return {
    manifestEntry: {
      file: manifestFilePath,
      src: sourceManifestKey,
      name: basename,
      isAsset: true,
      type: getCategory(ext),
      size: buffer.length,
    },
    sourceManifestKey,
  };
}

/**
 * Reads and processes the manifest file
 */
export function processManifest(manifestPath) {
  if (!fs.existsSync(manifestPath)) {
    assetsLog(
      `${STATIC_ASSETS_CONFIG.LOG_MESSAGES.PLUGIN_PREFIX} ${STATIC_ASSETS_CONFIG.ERROR_MESSAGES.MANIFEST_NOT_FOUND}`,
      manifestPath
    );
    return null;
  }

  return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}

/**
 * Writes the updated manifest back to file
 */
export function writeManifest(manifestPath, manifest, processedCount) {
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  assetsLog(
    `${STATIC_ASSETS_CONFIG.LOG_MESSAGES.PLUGIN_PREFIX} manifest.json extended with ${processedCount} static assets`
  );
}
