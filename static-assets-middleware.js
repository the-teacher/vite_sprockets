import path, { resolve } from "path";
import fs from "fs";
import { STATIC_ASSETS_CONFIG, getMimeType } from "./static-assets-config.js";
import { assetsLog } from "./static-assets-utils.js";

// Assets middleware function for handling /assets/* requests
export function staticAssetsMiddleware() {
  return (req, res, next) => {
    // assetsLog(
    //   `${STATIC_ASSETS_CONFIG.LOG_MESSAGES.REQUEST} ${req.method} ${req.url}`
    // );

    // Check if request is for assets
    if (req.url && req.url.startsWith(STATIC_ASSETS_CONFIG.BASE_PATH)) {
      assetsLog(`${STATIC_ASSETS_CONFIG.LOG_MESSAGES.HANDLING} ${req.url}`);

      // Extract filename from request URL (preserve subdirectory structure)
      const assetPath = req.url
        .replace(STATIC_ASSETS_CONFIG.BASE_PATH, "")
        .split("?")[0];
      const filePath = resolve(
        process.cwd(),
        STATIC_ASSETS_CONFIG.SOURCE_ASSETS_DIR,
        assetPath
      );

      // assetsLog(`${STATIC_ASSETS_CONFIG.LOG_MESSAGES.LOOKING} ${filePath}`);

      // Check if file exists
      if (fs.existsSync(filePath)) {
        assetsLog(`${STATIC_ASSETS_CONFIG.LOG_MESSAGES.FOUND} ${assetPath}`);

        // Determine content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentType = getMimeType(ext);

        // Set headers
        res.setHeader("Content-Type", contentType);
        res.setHeader(
          STATIC_ASSETS_CONFIG.HEADERS.CORS,
          STATIC_ASSETS_CONFIG.HEADERS.CORS_VALUE
        );

        // Add cache headers for better performance
        res.setHeader(
          "Cache-Control",
          STATIC_ASSETS_CONFIG.HEADERS.CACHE_CONTROL
        );

        // Read and send file
        const fileContent = fs.readFileSync(filePath);
        res.end(fileContent);
        return;
      } else {
        assetsLog(`${STATIC_ASSETS_CONFIG.LOG_MESSAGES.NOT_FOUND} ${filePath}`);
        res.statusCode = 404;
        res.end(
          `${STATIC_ASSETS_CONFIG.ERROR_MESSAGES.NOT_FOUND} ${assetPath}`
        );
        return;
      }
    }

    // Continue to next middleware
    next();
  };
}
