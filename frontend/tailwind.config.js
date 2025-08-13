/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7', 
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        secondary: {
          50: '#fef7ff',
          100: '#fceeff',
          200: '#f9ddff', 
          300: '#f5c2ff',
          400: '#ed98ff',
          500: '#e066ff',
          600: '#c43adb',
          700: '#a324b3',
          800: '#861e8f',
          900: '#6d1d74'
        },
        earth: {
          50: '#fefcf0',
          100: '#fdf6d9',
          200: '#fbeab2',
          300: '#f7d881', 
          400: '#f2c148',
          500: '#eba820',
          600: '#d18516',
          700: '#ad6314',
          800: '#8c4e17',
          900: '#744117'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '3d': '0 10px 20px rgba(0, 0, 0, 0.15), 0 6px 6px rgba(0, 0, 0, 0.1)',
        '3d-hover': '0 15px 30px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
}
