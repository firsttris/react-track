const base = require('./base'),
  webpack = require('webpack'),
  WebpackPwaManifest = require('webpack-pwa-manifest'),
  path = require('path');

base.mode = 'production';
base.module.rules.push({
  test: /\.tsx?$/,
  use: [
    {
      loader: 'ts-loader'
    }
  ]
});

base.optimization = {};

base.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    MOCKLOGIN: false
  }),
  new WebpackPwaManifest({
    name: 'Timetracking',
    short_name: 'Timetracking',
    description: 'awesome Timetracking with React!',
    background_color: '#ffffff',
    crossorigin: 'use-credentials', //can be null, use-credentials or anonymous
    icons: [
      {
        src: path.resolve('public/clock.png'),
        sizes: [96, 128, 192, 256, 384, 512] // multiple sizes
      }
    ]
  })
);

module.exports = base;
