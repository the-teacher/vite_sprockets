import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { staticAssetsMiddleware } from "./static-assets-middleware.js";
import { staticAssetsManifestPlugin } from "./static-assets-manifest-plugin.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  server: {
    host: "0.0.0.0",
  },

  // Static assets from public folder (like Rails public/assets)
  publicDir: "public",

  plugins: [
    {
      name: "serve-static-assets",
      // prioritisation of the plugin
      // move it to the top of the list
      // enforce: "pre",
      configureServer(server) {
        server.middlewares.use(staticAssetsMiddleware());
      },
    },
    // staticAssetsManifestPlugin(),
  ],

  build: {
    manifest: true,
    assetsDir: "test-assets",
    assetsInlineLimit: 0,

    rollupOptions: {
      input: {
        index1_html: resolve(__dirname, "index.html"),
        index2_html: resolve(__dirname, "index2.html"),

        index1_js: resolve(__dirname, "src/index.js"),
        index2_js: resolve(__dirname, "src/index2.js"),

        unused_asset_1: resolve(
          __dirname,
          "app/assets/images/unused-asset-1.svg"
        ),
        unused_asset_2: resolve(
          __dirname,
          "app/assets/images/unused-asset-2.svg"
        ),
        unused_asset_3: resolve(
          __dirname,
          "app/assets/images/unused-asset-3.svg"
        ),
      },
    },
  },
});
