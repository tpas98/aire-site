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
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #ddf0f9 0%, #b8d8ee 55%, #a8d1eb 100%)',
        'section-gradient': 'linear-gradient(150deg, #eaf5fb 0%, #c5dff0 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1a2e4a 0%, #0f1e32 100%)',
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
