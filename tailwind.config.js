/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sansita: ['Sansita', 'sans-serif'],
        nunito: ['"Nunito Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          orange:   '#FF6624',
          peach:    '#FAD4B2',
          charcoal: '#2A2A2A',
          black:    '#111111',
        },
      },
    },
  },
  plugins: [],
};
