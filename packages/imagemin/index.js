const merge = require('deepmerge');
const ImageminWebpackPlugin = require('imagemin-webpack/ImageminWebpackPlugin');
const gifsicle = require('imagemin-gifsicle');
const svgo = require('imagemin-svgo');
const pngquant = require('imagemin-pngquant');
const mozjpeg = require('imagemin-mozjpeg');
const webp = require('imagemin-webp');

const imageminLoader = require.resolve('imagemin-webpack/imagemin-loader');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    imagemin: {
      plugins: [
        gifsicle(),
        svgo(),
        pngquant(),
        mozjpeg(),
        webp()
      ]
    },
    plugin: {
      name: '[path][name].[ext]',
      test: /\.(svg|png|jpg|jpeg|gif|webp)$/
    },
    pluginId: 'imagemin',
    useId: 'imagemin',
    rules: ['svg', 'img']
  }, opts);

  options.plugin = merge({
    imageminOptions: options.imagemin
  }, options.plugin);

  options.rules.forEach((ruleId) => {
    neutrino.config.module
      .rule(ruleId)
      .use(options.useId)
        .loader(imageminLoader)
        .options(options.imagemin);
  });

  neutrino.config
    .plugin(options.pluginId)
    .use(ImageminWebpackPlugin, [options.plugin]);
};
