import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: "var(--primary-dark)",
          DEFAULT: "var(--primary-DEFAULT)",
        },
        gold: {
          DEFAULT: "var(--gold-DEFAULT)",
        },
        neutral: {
          light: "var(--neutral-light)",
        },
        secondary: {
          DEFAULT: "var(--secondary-DEFAULT)",
        },
        text: {
          dark: "var(--text-dark)",
        },
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "wave-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 C 30 20, 70 0, 100 10 L 100 0 L 0 0 Z' fill='%23d4af3710'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;
