/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        mist: {
          bg:      '#FAF7F2',
          card:    '#FFFFFF',
          sage:    '#8FAF8A',
          rose:    '#C9ADA7',
          warm:    '#3E2F25',
          faint:   '#F5EFE8',
          divider: '#F0E8DF',
          'sage-light': '#B8D4B3',
          'sage-dark':  '#6B8F66',
          'rose-light': '#E8D5D2',
          'warm-light': '#6B5248',
          'text':       '#2C2018',
          'text-muted': '#8A7060',
        }
      },
      fontFamily: {
        lora:  ['Lora', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 12px rgba(62,47,37,0.08)',
        'card-hover': '0 4px 20px rgba(62,47,37,0.14)',
      },
      borderRadius: {
        'xl2': '1.25rem',
        'xl3': '1.5rem',
      }
    },
  },
  plugins: [],
}
