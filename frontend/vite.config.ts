import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig({
  plugins: [
    react(),
    {
      ...purgeCss({
        content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.html"],
        safelist: [
          /^ReactModal/,
          /^Toast/,
          /-(leave|enter|appear)(|-(to|from|active))$/,
          /^(?!cursor-move).+-move$/,
          /^bg-/,
          /^text-/,
          /^hover:/,
        ],
      }),
      name: "purge-css",
      enforce: "post",
    } as PluginOption,
  ],
  server: {
    hmr: true, // Activation standard du Hot Module Replacement
  },
  base: "/", // Force les chemins absolus
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  appType: "spa", // Force le mode SPA
});
