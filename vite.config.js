import { defineConfig } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";

// Assets configuration constants
const ASSETS_CONFIG = {
  // Base URL path for assets handling
  BASE_PATH: "/assets/images/",

  // Source directory for assets
  SOURCE_DIR: "src/assets/images",

  // Supported file types and their MIME types
  CONTENT_TYPES: {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
  },

  // Default content type for unknown files
  DEFAULT_CONTENT_TYPE: "application/octet-stream",

  // HTTP headers
  HEADERS: {
    CORS: "Access-Control-Allow-Origin",
    CORS_VALUE: "*",
  },

  // Log messages
  LOG_MESSAGES: {
    REQUEST: "[DEBUG] Request:",
    HANDLING: "[ASSETS] Handling asset request:",
    LOOKING: "[ASSETS] Looking for file:",
    FOUND: "[ASSETS] File found, serving:",
    NOT_FOUND: "[ASSETS] File not found:",
  },

  // Error messages
  ERROR_MESSAGES: {
    NOT_FOUND: "Asset not found:",
  },
};

// Assets logging function (only works in development)
function assets_log(...args) {
  if (process.env.NODE_ENV !== "production") {
    console.log(...args);
  }
}

// Assets middleware function for handling /assets/images/* requests
function createAssetsMiddleware() {
  return (req, res, next) => {
    // assets_log(
    //   `${ASSETS_CONFIG.LOG_MESSAGES.REQUEST} ${req.method} ${req.url}`
    // );

    // Check if request is for assets
    if (req.url && req.url.startsWith(ASSETS_CONFIG.BASE_PATH)) {
      assets_log(`${ASSETS_CONFIG.LOG_MESSAGES.HANDLING} ${req.url}`);

      // Extract filename from request URL
      const filename = req.url
        .replace(ASSETS_CONFIG.BASE_PATH, "")
        .split("?")[0];
      const filePath = resolve(__dirname, ASSETS_CONFIG.SOURCE_DIR, filename);

      // assets_log(`${ASSETS_CONFIG.LOG_MESSAGES.LOOKING} ${filePath}`);

      // Check if file exists
      if (fs.existsSync(filePath)) {
        assets_log(`${ASSETS_CONFIG.LOG_MESSAGES.FOUND} ${filename}`);

        // Determine content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        const contentType =
          ASSETS_CONFIG.CONTENT_TYPES[ext] ||
          ASSETS_CONFIG.DEFAULT_CONTENT_TYPE;

        // Set headers
        res.setHeader("Content-Type", contentType);
        res.setHeader(
          ASSETS_CONFIG.HEADERS.CORS,
          ASSETS_CONFIG.HEADERS.CORS_VALUE
        );

        // Read and send file
        const fileContent = fs.readFileSync(filePath);
        res.end(fileContent);
        return;
      } else {
        assets_log(`${ASSETS_CONFIG.LOG_MESSAGES.NOT_FOUND} ${filePath}`);
        res.statusCode = 404;
        res.end(`${ASSETS_CONFIG.ERROR_MESSAGES.NOT_FOUND} ${filename}`);
        return;
      }
    }

    // Continue to next middleware
    next();
  };
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        page2: resolve(__dirname, "page2.html"),
      },
    },
  },
  server: {
    host: "0.0.0.0",
  },
  plugins: [
    {
      name: "assets-middleware",
      configureServer(server) {
        server.middlewares.use(createAssetsMiddleware());
      },
    },
  ],
  // Static assets from public folder (like Rails public/assets)
  publicDir: "public",
});
