/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: '#e8f0fe',
          100: '#d0e4fd',
          200: '#a7c9fa',
          300: '#74a3f6',
          400: '#407cef',
          500: '#1e3a5f',
          600: '#1a3252',
          700: '#162a46',
          800: '#122239',
          900: '#0e1a2c',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
    },
  },
  plugins: [],
};
