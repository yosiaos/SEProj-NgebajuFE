import { transform } from 'next/dist/build/swc/generated-native';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        revealTop:{
          "0%": {
            transform: "translateY(-50px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        revealBot:{
          "0%": {
            transform: "translateY(50px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        }
      },
      animation: {
        revealBot: "revealBot 1.4s ease-in-out forwards",
        revealTop: "revealTop 1.4s ease-in-out forwards"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        thirtiery: "var(--thirtiery)"
      },
    },
  },
  plugins: [],
};
