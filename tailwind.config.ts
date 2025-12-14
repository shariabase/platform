import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'topmenu': '0 1px 0 rgba(255,255,255,0.06) inset, 0 10px 30px rgba(0,0,0,0.35)',
      },
      colors: {
        surface: {
          950: '#05070C',
          900: '#070A10',
          850: '#0A0F18'
        },
        accent: {
          400: '#B7FF76',
          500: '#97F04D'
        }
      }
    },
  },
  plugins: [],
} satisfies Config;
