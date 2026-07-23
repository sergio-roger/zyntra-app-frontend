/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        // Variante más oscura de `secondary` (#7c3aed) — no existía en la
        // paleta Zyntra, se agrega para botones/superficies moradas sin
        // recurrir a un border.
        'secondary-deep': '#2e0d3f',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        'zyntra-dark': {
          'primary': '#7c3aed',
          'primary-content': '#ffffff',
          'secondary': '#7c3aed',
          'secondary-content': '#ffffff',
          'accent': '#b95f00',
          'accent-content': '#ffffff',
          'neutral': '#1e293b',
          'neutral-content': '#f8fafc',
          'base-100': '#020617',
          'base-200': '#0f172a',
          'base-300': '#1e293b',
          'base-content': '#f8fafc',
          'info': '#0ea5e9',
          'info-content': '#ffffff',
          'success': '#10b981',
          'success-content': '#ffffff',
          'warning': '#f59e0b',
          'warning-content': '#ffffff',
          'error': '#ef4444',
          'error-content': '#ffffff',
        },
      },
      'light',
    ],
  },
};