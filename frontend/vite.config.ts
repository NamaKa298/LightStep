import react from "@vitejs/plugin-react";
import type { PluginOption } from "vite";
import { defineConfig } from "vite";
import purgeCss from "vite-plugin-purgecss";

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
    {
      ...purgeCss({
        content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.html"],
        safelist: [/^ReactModal/, /^Toast/, /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!cursor-move).+-move$/, /^bg-/, /^text-/, /^hover:/],
      }),
      name: "purge-css",
      enforce: "post",
    } as PluginOption,
  ],
  server: {
    hmr: true, // Activation standard du Hot Module Replacement
    proxy: {
      "/api": {
        target: "http://localhost:3001", // ton backend
        changeOrigin: true,
        secure: false,
      },
    },
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
