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
    shared: path.resolve('src/app', 'shared'),
    scenes: path.resolve('src/app', 'scenes'),
    constants: path.resolve('src', 'constants'),
    utils: path.resolve('src', 'utils')
  })
);