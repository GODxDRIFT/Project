// postcss.config.js

const purgecss = require('@fullhuman/postcss-purgecss')({
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
});

module.exports = {
  plugins: [
    require('autoprefixer'),
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
