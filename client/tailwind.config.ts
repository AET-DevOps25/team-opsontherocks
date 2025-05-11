import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
      colors: {
        pageBg: {
          light: '#ffffff',
          dark: '#242424',
        },
        pageText: {
          light: 'rgba(33, 53, 71, 0.87)',
          dark: 'rgba(255, 255, 255, 0.87)',
        },
      },
    },
  },
  plugins: [],
}

export default config
