'use strict'
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
// webpack基本配置文件
const baseWebpackConfig = require('./webpack.base.conf');
// 配置
const config = require('./config');
// 工具
const utils = require('./utils');

// 开发环境配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // CSS样式文件loader
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true})
  },
  // 在开发模式中使用cheap-module-eavl-source-map最快
  devtool: config.dev.devtool,
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { form: /.*/, to: path.posix.join(config.assetsPublicPath, 'index.html') },
      ]
    },
    hot: true,
    contentBase: false, // 使用CopyWebpackPlugin
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? config.dev.errorOverlay
      : false,
    publicPath: config.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // 使用FriendlyErrorsPlugin必须指定
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': require('../config/dev.env')
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR在控制台显示正确的文件名
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ],
  mode: 'development'
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = config.dev.port;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      // process.env.PORT = port;
      // 添加端口到devServer配置里面
      devWebpackConfig.devServer.port = port;

      // 添加友好提示插件
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
          ? utils.createNotifierCallback()
          : undefined
      }))

      resolve(devWebpackConfig)
    }
  });
})