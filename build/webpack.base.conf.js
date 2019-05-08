'use strict'
const path = require('path');
// 配置文件
const config = require('./config');
// 工具文件
const utils = require('./utils')

function resolve (dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsPath,
    filename: '[name].js',
    publicPath: config.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      { // js
        test: /\.js$/,
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      { // 图片文件
        test: /\.(jpe?g|png|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240, // 小于10Kb的图形文件直接转换成Base64格式
          name: utils.assetsPath('img/[name].[hash:8].[ext]')
        }
      },
      { // 字体文件
        test: /\.(woff2?|otf|ttf|eot)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: utils.assetsPath('fonts/[name].[hash:8].[ext]')
        }
      },
      { // 媒体文件
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: utils.assetsPath('media/[name].[hash:8].[ext]')
        }
      }
    ]
  }
}