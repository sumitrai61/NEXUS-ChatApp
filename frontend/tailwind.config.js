import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        messageHighlightFade: {
          "0%": { opacity: "1" },
          "70%": { opacity: "0.6" },
          "100%": { opacity: "0" },
        },
        messageHighlightReveal: {
          "0%": { opacity: "0.7" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "message-highlight-fade": "messageHighlightFade 1200ms ease-out forwards",
        "message-highlight-reveal": "messageHighlightReveal 500ms ease-out forwards",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};