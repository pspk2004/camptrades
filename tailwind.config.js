/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'hsl(210, 40%, 50%)',
          '50': 'hsl(210, 40%, 95%)',
          '100': 'hsl(210, 40%, 90%)',
          '200': 'hsl(210, 40%, 80%)',
          '300': 'hsl(210, 40%, 70%)',
          '400': 'hsl(210, 40%, 60%)',
          '500': 'hsl(210, 40%, 50%)',
          '600': 'hsl(210, 40%, 40%)',
          '700': 'hsl(210, 40%, 30%)',
          '800': 'hsl(210, 40%, 20%)',
          '900': 'hsl(210, 40%, 10%)',
          '950': 'hsl(210, 40%, 5%)'
        }
      }
    }
  },
  plugins: [],
}
