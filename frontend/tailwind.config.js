/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./src/components/ui/**/*.{js,ts,jsx,tsx}",
    "./src/components/comp-258.tsx",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },

  plugins: [],
};
