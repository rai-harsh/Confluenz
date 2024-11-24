/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '365px', // Adding the xs breakpoint
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },slideOut: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out forwards',
        slideOut: 'slideOut 0.3s ease-out forwards',
      },
      fontFamily:{
        'display':['Montserrat','sans-serif'],
        'body':['Inter', 'sans-serif'],
        'beu':['Bebas Neue', 'sans-serif']
      },
      colors:{
        'primary':'#3238f2'
      }
    },
  },
  plugins: [],
}

