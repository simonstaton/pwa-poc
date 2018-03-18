const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = merge(webpackConfig, {
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new WebpackPwaManifest({
      filename: 'web-manifest.json',
      inject: true,
      ios: true,
      lang: 'en-GB',
      name: 'Digital Garage',
      short_name: 'DG',
      start_url: 'https://61b14353.ngrok.io',
      display: 'standalone',
      orientation: 'any',
      background_color: '#FFFFFF',
      theme_color: '#00BFA5',
      prefer_related_applications: false,
      related_applications: [
        {
          platform: 'play',
          id: 'com.google.android.apps.growthengine'
        }
      ],
      icons: [
        {
          src: path.resolve('assets/images/icon.png'),
          type: 'image/png',
          sizes: [96, 128, 192, 256, 384, 512]
        }
      ]
    }),
    new CleanWebpackPlugin(['dist'])
  ],
});
