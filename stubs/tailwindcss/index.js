module.exports = function() {
  // No-op PostCSS plugin to satisfy Angular builder without executing Tailwind logic
  return {
    postcssPlugin: 'tailwindcss-stub',
    Once() {},
  };
};
module.exports.postcss = true;
