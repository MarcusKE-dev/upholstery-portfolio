import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Jost"', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      colors: {
        cream: { 50: '#FDFAF4', 100: '#FAF5E9', 200: '#F5EDD4' },
        espresso: { DEFAULT: '#2C1810', light: '#4A2E1E' },
        gold: { DEFAULT: '#C9A84C', light: '#E2C47A' },
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        shimmer: 'shimmer 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config