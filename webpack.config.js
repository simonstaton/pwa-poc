const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const IS_DEV = (process.env.NODE_ENV === 'dev');

const dirNode = 'node_modules';
const dirApp = path.join(__dirname, 'app');
const dirAssets = path.join(__dirname, 'assets');

// Env
const APP_URL = 'http://127.0.0.1:8080';
const PUSH_SERVICE_URL = 'http://127.0.0.1:8081';

module.exports = {
  entry: {
    vendor: [
      'lodash'
    ],
    bundle: path.join(dirApp, 'index'),
    'global.styles': path.join(dirAssets, 'styles/index.scss'),
    'homepage.styles': path.join(dirAssets, 'styles/homepage/_index.scss'),
    'login.styles': path.join(dirAssets, 'styles/login/_index.scss')
  },
  resolve: {
    modules: [
      dirNode,
      dirApp,
      dirAssets
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEV: IS_DEV,
      VAPID_PUB_KEY: JSON.stringify(require('./vapid-keys').public),
      PUSH_SERVICE_URL: JSON.stringify(PUSH_SERVICE_URL),
      APP_URL: JSON.stringify(APP_URL)
    }),
    new WebpackPwaManifest({
      filename: 'web-manifest.json',
      lang: 'en-GB',
      name: 'Google Learn GO',
      short_name: 'GLG',
      start_url: APP_URL + '/dashboard.html',
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
    new ExtractTextPlugin({
      filename: '[name].css',
      disable: process.env.NODE_ENV === 'development'
    }),
    new HtmlWebpackPlugin({
      title: 'Learn Online Marketing - Free Training Course From Google',
      active: 'home',
      template: path.join(__dirname, 'views/index.ejs'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      excludeAssets: [/styles.js/, /login.styles/]
    }),
    new HtmlWebpackPlugin({
      filename: 'login.html',
      title: 'Sign-in',
      template: path.join(__dirname, 'views/login.ejs'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      excludeAssets: [/styles.js/, /homepage.styles/]
    }),
    new HtmlWebpackPlugin({
      filename: 'dashboard.html',
      title: 'Dashboard',
      template: path.join(__dirname, 'views/dashboard.ejs'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      excludeAssets: [/styles.js/, /login.styles/, /homepage.styles/]
    }),
    new HtmlWebpackPlugin({
      filename: 'lesson.html',
      title: 'Lesson',
      template: path.join(__dirname, 'views/lesson.ejs'),
      minify: {
        removeComments: true,
        collapseWhitespace: true
      },
      excludeAssets: [/styles.js/, /login.styles/, /homepage.styles/]
    }),
    new HtmlWebpackExcludeAssetsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            }, 
            'sass-loader'
          ]
        })
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
        options: {
          compact: true
        }
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-compiled-loader'
      },
      {
        test: /\.(png|jpeg|jpg|ttf|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[path][name].[ext]',
              publicPath: './',
              useRelativePath: process.env.NODE_ENV === "production"
            }
          }
        ]
      }
    ]
  }
};
