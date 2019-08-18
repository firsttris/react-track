const path = require('path'),
  htmlWebpackPlugin = require('html-webpack-plugin'),
  tsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin'),
  fsExtra = require("fs-extra");
  
fsExtra.emptyDirSync(path.join(__dirname, "../dist-web"));
fsExtra.emptyDirSync(path.join(__dirname, "../dist-electron"));
fsExtra.emptyDirSync(path.join(__dirname, "../builds"));

module.exports = {
  target: process.env.app === 'web' ? 'web' : 'electron-renderer',
  entry: {
    gui: './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, process.env.app === 'web' ? '../dist-web' : '../dist-electron'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|eot|svg|ttf|woff|woff2)$/,
        use: [
          { loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]' }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'],
    plugins: [
      new tsConfigPathsPlugin()
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: 'public/index.html',
      minify: process.env.config === 'prod'
    })
  ]
};
