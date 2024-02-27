import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '500px',
      },
      colors: {
        green: {
          50: '#F2F9E4',
          100: '#E8F4D8',
          200: '#D9F0B9',
          300: '#C8E2A3',
          400: '#B6CE95',
          500: '#96AA7B',
          600: '#798865',
          700: '#576646',
          800: '#445135',
          900: '#2D3524',
          950: '#1A1F15',
        },
      },
    },
    fontFamily: {
      sans: ['Sora', 'sans-serif'],
    },
  },
  plugins: [],
};
export default config;
