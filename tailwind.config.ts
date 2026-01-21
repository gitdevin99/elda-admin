import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        cyan: "#00F0FF",
        purple: "#7000FF",
        amber: "#FFD700",
      },
    },
  },
  plugins: [],
};

export default config;
