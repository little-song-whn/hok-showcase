/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(224 71% 4%)',
        muted: 'hsl(210 16% 93%)',
        primary: 'hsl(262 83% 58%)',
      }
    },
  },
  plugins: [],
}
