/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'color-primary': '#4F39D7',
        'color-accent': '#FEA501',
        'color-highlight': '#2BC8F2',
        'color-primary-black': '#000000',
        primary: {
          DEFAULT: '#4F39D7',
          accent: '#FEA501',
          highlight: '#2BC8F2',
          black: '#000000',
        },
        glossy: {
          50: '#fef7ee',
          100: '#fdecd6',
          200: '#fbd5ac',
          300: '#f8b877',
          400: '#f59140',
          500: '#F1A93B',
          600: '#dd6d1a',
          700: '#b85317',
          800: '#93421a',
          900: '#773819',
        },
      },
      backgroundImage: {
        'glossy-gradient': 'linear-gradient(135deg, #4F39D7 0%, #2BC8F2 50%, #FEA501 100%)',
        'glossy-shine': 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        'glossy': '0 8px 32px 0 rgba(79, 57, 215, 0.37)',
        'glossy-lg': '0 15px 45px 0 rgba(79, 57, 215, 0.45)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'shine': 'shine 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        shine: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
