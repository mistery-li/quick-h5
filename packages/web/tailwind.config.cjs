/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  /* variants: {
    extend: {},
  }, */
  plugins: [],
}
