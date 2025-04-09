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
        primary: {
          DEFAULT: '#0072F5',
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0057cc',
          600: '#004099',
          700: '#002a66',
          800: '#001333',
          900: '#000000',
        },
        success: '#17C964',
        warning: '#F5A524',
        danger: '#F31260',
      }
    },
  },
  plugins: [],
}
