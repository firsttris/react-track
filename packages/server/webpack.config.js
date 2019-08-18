const path = require('path'),
  webpack = require('webpack'),
  cleanWebpackPlugin = require('clean-webpack-plugin'),
  tsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

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
    plugins: [
      new tsConfigPathsPlugin()
    ]
  },
  plugins: [
    new cleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
};
