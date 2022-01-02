const { addWebpackAlias, override, addWebpackModuleRule } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackModuleRule({
    test: /\.worker\.js$/,
    use: { loader: 'worker-loader' },
  }),

  addWebpackAlias({
    stylesheets: path.resolve('src/assets', 'stylesheets'),
    images: path.resolve('src/assets', 'images'),
    fonts: path.resolve('src/assets', 'fonts'),
    components: path.resolve('src/components', 'components'),
  })
);