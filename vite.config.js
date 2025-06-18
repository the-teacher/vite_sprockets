import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fg from "fast-glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assetFiles = fg.sync(
  [
    "*.html",
    "src/*.js",
    "app/assets/**/*.{png,jpg,jpeg,svg,gif,html,js,css}",
    "src/assets/**/*.{png,jpg,jpeg,svg,gif,html,js,css}",
  ],
  { absolute: true }
);

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },

  // Static assets from public folder (like Rails public/assets)
  publicDir: "public",

  resolve: {
    alias: {
      // Aliases to resolve paths in SCSS files
      // Also could be used for other assets
      "@": resolve(__dirname, "src"),
      "@app": resolve(__dirname, "app"),
      app: resolve(__dirname, "app"),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Add paths to resolve paths in SCSS files
        includePaths: [
          resolve(__dirname, "app/assets"),
          resolve(__dirname, "src/assets"),
        ],
      },
    },
  },

  plugins: [],

  build: {
    // Define manifest.json file. Will be like: dist/.vite/manifest.json
    manifest: true,
    // Define assets directory. Will be like: dist/assets/index-BAxCH499.js
    assetsDir: "assets",
    // Do not inline assets
    assetsInlineLimit: 0,

    rollupOptions: {
      input: [
        // define Asset files directly
        ...assetFiles,
      ],
    },
  },
});
