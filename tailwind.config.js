/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        calm: {
          blue: {
            50: '#f0f7ff',
            100: '#e0efff',
            200: '#b8deff',
            300: '#7cc4fa',
            400: '#36a9f4',
            500: '#0c8ce9',
            600: '#006fc7',
            700: '#0158a1',
            800: '#064a85',
            900: '#0b3e6e',
          },
          sage: {
            50: '#f6f8f6',
            100: '#e3e9e3',
            200: '#c7d4c8',
            300: '#a1b5a3',
            400: '#7a9580',
            500: '#5d7864',
            600: '#475f4e',
            700: '#3a4d40',
            800: '#2f3f35',
            900: '#28342d',
          },
          neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
          },
        },
      },
    },
  },
  plugins: [],
};
