/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./src/components/*.{html,js,ts,jsx,tsx}",
    "./src/components/*.{html,js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
