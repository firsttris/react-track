const base = require('./base'),
  webpack = require('webpack')
  webappWebpackPlugin = require('webapp-webpack-plugin');
  
base.mode = "production";
base.module.rules.push(
  {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader'
      }
    ]
  }
);

base.optimization = {
};

base.plugins.push(
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
    MOCKLOGIN: false
  }),
  new webappWebpackPlugin({
    logo: './public/logo.png',
    prefix: 'webapp/',
    favicons: {
      appName: 'Zeiterfassung',
      theme_color: "black", 
    }
  }),
);

module.exports = base;
