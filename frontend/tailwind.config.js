/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B9BD1',
        secondary: '#A8D5BA',
        accent: '#F7E7D4',
        dark: '#2C3E50',
        light: '#ECF0F1'
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #6B9BD1 0%, #A8D5BA 100%)',
      }
    },
  },
  plugins: [],
}
