/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1a2e4a',
        'navy-mid': '#2c4a6b',
        accent: '#5a9bbf',
        'sky-deep': '#7ec2df',
        'sky-light': '#c8e6f5',
        'off-white': '#f3f8fc',
        muted: '#6a8099',
        teal: '#84afb5',
        gold: '#e8a820',
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(3rem, 7.5vw, 6.5rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        h2: ['clamp(2.3rem, 4.5vw, 3.8rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h3: ['clamp(1.4rem, 2vw, 1.8rem)', { lineHeight: '1.15' }],
        eyebrow: ['0.67rem', { letterSpacing: '0.2em', lineHeight: '1.4' }],
        'body-lg': ['1.05rem', { lineHeight: '1.8' }],
        'body-base': ['0.95rem', { lineHeight: '1.8' }],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #d8ecf8 0%, #b0d1e8 52%, #90bada 100%)',
        'section-gradient': 'linear-gradient(150deg, #eaf5fb 0%, #c5dff0 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a2e4a 0%, #0f1e32 100%)',
      },
      boxShadow: {
        btn: '0 8px 28px rgba(26,46,74,0.22)',
        'btn-hover': '0 16px 44px rgba(26,46,74,0.30)',
        'card-hover': '0 24px 56px rgba(26,46,74,0.09)',
        'card-dark': '0 20px 48px rgba(0,0,0,0.25)',
        'pill-hover': '0 8px 24px rgba(26,46,74,0.10)',
      },
      borderRadius: {
        'aire-sm': '12px',
        'aire-md': '16px',
        'aire-lg': '18px',
        'aire-xl': '24px',
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
