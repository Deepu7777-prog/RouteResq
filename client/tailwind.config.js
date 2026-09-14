/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0F172A',      // Deep navy primary
          blue: '#1D4ED8',      // Government blue
          sky: '#38BDF8',       // Soft sky blue
          teal: '#0284C7',      // Soft teal
          slate: '#475569',     // Muted slate text
          light: '#F8FAFC',     // Light background off-white
          card: '#FFFFFF',      // White card bg
          border: '#E2E8F0',    // Soft border slate
          emerald: '#10B981',   // Soft green safe
          amber: '#F59E0B',     // Soft warning amber
          rose: '#EF4444'       // Muted red blocked
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
