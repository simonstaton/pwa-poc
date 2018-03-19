const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const dirAssets = path.join(__dirname, 'assets');

// Env
const APP_URL = 'http://127.0.0.1:8080';
const PUSH_SERVICE_URL = 'http://127.0.0.1:8081';

module.exports = merge(webpackConfig, {
  devtool: 'eval',
  output: {
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      PUSH_SERVICE_URL: JSON.stringify(PUSH_SERVICE_URL),
      APP_URL: JSON.stringify(APP_URL)
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
        ]
      }
    ]
  }
});
