const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const dirAssets = path.join(__dirname, 'assets');

module.exports = merge(webpackConfig, {
  devtool: 'eval',
  output: {
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js'
  },
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
