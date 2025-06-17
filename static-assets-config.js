// Common configuration for static assets handling
export const STATIC_ASSETS_CONFIG = {
  // Base directories
  SOURCE_DIR: "src",
  DIST_DIR: "dist",
  ASSETS_DIR: "assets", // Directory name for assets (both in source and dist)
  MANIFEST_DIR: ".vite", // Directory for manifest file
  MANIFEST_FILE: "manifest.json", // Manifest filename

  // Computed paths based on base directories
  get SOURCE_ASSETS_DIR() {
    return `${this.SOURCE_DIR}/${this.ASSETS_DIR}`;
  },

  get DIST_ASSETS_DIR() {
    return `${this.DIST_DIR}/${this.ASSETS_DIR}`;
  },

  get BASE_PATH() {
    return `/${this.ASSETS_DIR}/`;
  },

  get MANIFEST_PATH() {
    return `${this.MANIFEST_DIR}/${this.MANIFEST_FILE}`;
  },

  // File type definitions with both MIME types and categories
  FILE_TYPES: {
    // Images
    ".png": { mime: "image/png", category: "image" },
    ".jpg": { mime: "image/jpeg", category: "image" },
    ".jpeg": { mime: "image/jpeg", category: "image" },
    ".gif": { mime: "image/gif", category: "image" },
    ".svg": { mime: "image/svg+xml", category: "image" },
    ".webp": { mime: "image/webp", category: "image" },
    ".ico": { mime: "image/x-icon", category: "image" },
    ".bmp": { mime: "image/bmp", category: "image" },
    ".tiff": { mime: "image/tiff", category: "image" },

    // Documents
    ".pdf": { mime: "application/pdf", category: "document" },
    ".txt": { mime: "text/plain", category: "document" },
    ".md": { mime: "text/markdown", category: "document" },
    ".doc": { mime: "application/msword", category: "document" },
    ".docx": {
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      category: "document",
    },
    ".rtf": { mime: "application/rtf", category: "document" },

    // Videos
    ".mp4": { mime: "video/mp4", category: "video" },
    ".webm": { mime: "video/webm", category: "video" },
    ".ogv": { mime: "video/ogg", category: "video" },
    ".avi": { mime: "video/x-msvideo", category: "video" },
    ".mov": { mime: "video/quicktime", category: "video" },
    ".wmv": { mime: "video/x-ms-wmv", category: "video" },

    // Audio
    ".mp3": { mime: "audio/mpeg", category: "audio" },
    ".wav": { mime: "audio/wav", category: "audio" },
    ".ogg": { mime: "audio/ogg", category: "audio" },
    ".flac": { mime: "audio/flac", category: "audio" },
    ".aac": { mime: "audio/aac", category: "audio" },

    // Fonts
    ".ttf": { mime: "font/ttf", category: "font" },
    ".otf": { mime: "font/otf", category: "font" },
    ".woff": { mime: "font/woff", category: "font" },
    ".woff2": { mime: "font/woff2", category: "font" },
    ".eot": { mime: "application/vnd.ms-fontobject", category: "font" },

    // Archives
    ".zip": { mime: "application/zip", category: "archive" },
    ".rar": { mime: "application/vnd.rar", category: "archive" },
    ".tar": { mime: "application/x-tar", category: "archive" },
    ".gz": { mime: "application/gzip", category: "archive" },

    // Data
    ".json": { mime: "application/json", category: "data" },
    ".xml": { mime: "application/xml", category: "data" },
    ".csv": { mime: "text/csv", category: "data" },
    ".yml": { mime: "application/x-yaml", category: "data" },
    ".yaml": { mime: "application/x-yaml", category: "data" },
  },

  // Default values
  DEFAULT_MIME_TYPE: "application/octet-stream",
  DEFAULT_CATEGORY: "unknown",

  // HTTP headers
  HEADERS: {
    CORS: "Access-Control-Allow-Origin",
    CORS_VALUE: "*",
    CACHE_CONTROL: "public, max-age=31536000", // 1 year
  },

  // Log messages
  LOG_MESSAGES: {
    REQUEST: "[DEBUG] Request:",
    HANDLING: "[ASSETS] Handling asset request:",
    LOOKING: "[ASSETS] Looking for file:",
    FOUND: "[ASSETS] File found, serving:",
    NOT_FOUND: "[ASSETS] File not found:",
    PLUGIN_PREFIX: "[static-assets-manifest-plugin]",
  },

  // Error messages
  ERROR_MESSAGES: {
    NOT_FOUND: "Asset not found:",
    MANIFEST_NOT_FOUND: "manifest.json not found:",
  },
};

// Helper functions for working with file types
export function getMimeType(extension) {
  const fileType = STATIC_ASSETS_CONFIG.FILE_TYPES[extension.toLowerCase()];
  return fileType ? fileType.mime : STATIC_ASSETS_CONFIG.DEFAULT_MIME_TYPE;
}

export function getCategory(extension) {
  const fileType = STATIC_ASSETS_CONFIG.FILE_TYPES[extension.toLowerCase()];
  return fileType ? fileType.category : STATIC_ASSETS_CONFIG.DEFAULT_CATEGORY;
}

export function isSupportedFileType(extension) {
  return extension.toLowerCase() in STATIC_ASSETS_CONFIG.FILE_TYPES;
}
