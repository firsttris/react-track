const path = require('path'),
  webpack = require('webpack'),
  tsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
  fsExtra = require('fs-extra');

fsExtra.emptyDirSync(path.join(__dirname, 'dist'));

module.exports = {
  mode: 'production',
  target: 'node',
  context: __dirname,
  entry: ['./src/index.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: []
      }
    ]
  },
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json'],
    plugins: [new tsConfigPathsPlugin()]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
