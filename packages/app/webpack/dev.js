const base = require('./base'),
  webpack = require('webpack'),
  ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

base.mode = "development";
base.module.rules.push(
  {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: {
          babelrc: true,
          plugins: ['react-hot-loader/babel']
        }
      },
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ]
  }
);

base.devServer = {
  hot: true,
  host: "0.0.0.0",
  port: 8080,
  historyApiFallback: true
};

base.plugins.push(
  new ForkTsCheckerWebpackPlugin(),
  new webpack.DefinePlugin({
    MOCKLOGIN: false
  }),
  new webpack.NamedModulesPlugin(),
  new webpack.HotModuleReplacementPlugin()
);

module.exports = base;
