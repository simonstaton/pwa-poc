const path = require('path');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const dirAssets = path.join(__dirname, 'assets');

module.exports = merge(webpackConfig, {
  devtool: 'eval',
  output: {
    pathinfo: true,
    publicPath: '/',
    filename: '[name].js'
  },
  plugins: [
    new WebpackPwaManifest({
      filename: 'web-manifest.json',
      lang: 'en-GB',
      name: 'Digital Garage Development',
      short_name: 'DG',
      start_url: ' https://473cf4af.ngrok.io',
      display: 'standalone',
      orientation: 'any',
      background_color: '#FFFFFF',
      theme_color: '#00BFA5',
      icons: [
        {
          src: path.resolve('assets/images/icon.png'),
          type: 'image/png',
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
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
