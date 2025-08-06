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
        safelist: [/^ReactModal/, /^Toast/, /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!cursor-move).+-move$/, /^bg-/, /^text-/, /^hover:/],
      }),
      name: "purge-css",
      enforce: "post",
    } as PluginOption,
  ],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
