/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      colors: {
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
