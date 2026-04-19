import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "helvetica neue", "helvetica", "arial", "sans-serif"],
      },
      colors: {
        cs: {
          bg:      "#111111",
          surface: "#1c1c1c",
          surface2:"#242424",
          border:  "#2e2e2e",
          accent:  "#da183c",
          accent2: "#ff2d52",
          text:    "#ffffff",
          muted:   "#888888",
        },
      },
    },
  },
  plugins: [],
};
export default config;
