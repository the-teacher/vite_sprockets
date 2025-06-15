import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createAssetsMiddleware } from "./serve-static-assets.js";

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
      configureServer(server) {
        server.middlewares.use(createAssetsMiddleware());
      },
    },
  ],

  build: {
    manifest: true,

    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        page2: resolve(__dirname, "index2.html"),
      },
    },
  },
});
