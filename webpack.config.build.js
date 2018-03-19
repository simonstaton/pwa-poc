const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpackConfig = require('./webpack.config');
const WebpackPwaManifest = require('webpack-pwa-manifest');

// Env
const APP_URL = 'http://localhost:8887';
const PUSH_SERVICE_URL = 'https://digital-garage-push-server.herokuapp.com';

module.exports = merge(webpackConfig, {
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  plugins: [
    new webpack.DefinePlugin({
      PUSH_SERVICE_URL: JSON.stringify(PUSH_SERVICE_URL),
      APP_URL: JSON.stringify(APP_URL)
    }),
    new WebpackPwaManifest({
      filename: 'web-manifest.json',
      inject: true,
      ios: true,
      lang: 'en-GB',
      name: 'Google Learn GO',
      short_name: 'Learn',
      start_url: APP_URL + '/login.html',
      display: 'standalone',
      orientation: 'any',
      background_color: '#FFFFFF',
      theme_color: '#6ccd79',
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
