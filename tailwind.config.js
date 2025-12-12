/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        // Role-specific colors
        'product-owner': '#3B82F6',
        'sharia-scholar': '#059669',
        'legal-compliance': '#7C3AED',
        'risk-audit': '#DC2626',
        'engineering': '#F59E0B',
        'sales-service': '#EC4899',
        'regulator': '#6B7280',
        'customer': '#14B8A6',
      },
    },
  },
  plugins: [],
}
