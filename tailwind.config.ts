import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        botchain: {
          50: "#eef8ff",
          100: "#d9effe",
          200: "#bce2fe",
          300: "#8eccfd",
          400: "#59adfb",
          500: "#328cf6",
          600: "#1c6fe9",
          700: "#1557d4",
          800: "#1747ab",
          900: "#183d87",
          950: "#102553",
        },
      },
    },
  },
  plugins: [],
};

export default config;
