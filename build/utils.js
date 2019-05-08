'use strict'
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./config');

// 拼接文件路径
exports.assetsPath = function (_path) {
  // const assetsSubDirectory = process.env.NODE_ENV === 'production'
  //   ? config.build.assetsSubDirectory
  //   : config.dev.assetsSubDirectory

  return path.posix.join(config.assetsSubDirectory, _path)
}

// 添加样式loader
exports.cssLoaders = function (options) {
  options = options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (options.useExtract) {
      loaders.unshift({
        loader: MiniCssExtractPlugin.loader
      })
    } else {
      loaders.unshift({
        loader: 'style-loader'
      })
    }

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }
    return loaders;
  }
  
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}
exports.styleLoaders = function (options) {
  const output = [];
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output;
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') {
      return;
    }
    const error = errors[0];
    notifier.notify({
      title: "Webpack error",
      message: severity + ': ' + error.name,
      subtitle: error.file || '',
    });
  }
}