import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { staticAssetsMiddleware } from "./static-assets-middleware.js";
import { staticAssetsManifestPlugin } from "./static-assets-manifest-plugin.js";
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

  plugins: [
    // {
    //   name: "serve-static-assets",
    //   // Plugin prioritisation
    //   // move it to the top of the list
    //   // enforce: "pre",
    //   configureServer(server) {
    //     server.middlewares.use(staticAssetsMiddleware());
    //   },
    // },
    // staticAssetsManifestPlugin(),
  ],

  build: {
    manifest: true,
    assetsDir: "assets",
    assetsInlineLimit: 0,

    rollupOptions: {
      input: [
        // HTML files
        // resolve(__dirname, "index.html"),
        // resolve(__dirname, "index2.html"),

        // JS files
        // resolve(__dirname, "src/index.js"),
        // resolve(__dirname, "src/index2.js"),

        // Assets directly
        ...assetFiles,
      ],
    },
  },
});
