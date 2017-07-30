'use strict';
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('bundle.css');

const config = {
  entry: {
    app: __dirname + '/src/app/app.module.ts',
    vendor: [
        'lodash',
        'angular',
        'angular-route',
        'angular-cookies',
        'angular-animate',
        'angular-aria',
        'angular-material',
        'angular-messages'
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: "/assets/",
    devtoolLineToLine: true
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          { loader: 'ng-annotate-loader' },
          { loader: 'ts-loader' }
        ]
      },
      {
        test: /\.(css|less)$/,
        use: extractCSS.extract([
          { loader: 'css-loader', options: { sourceMap: true } },
          { loader: 'less-loader', options: { sourceMap: true } }
        ])     
      },
      {
        test: /\.jpg$/,
        loader: 'file'
      },
      {
        test: /\.png$/,
        loader: "url-loader?mimetype=image/png"
      },
      { 
        test: /\.json$/, 
        loader: "json-loader"
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "vendor.bundle.js" }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      compress: {
        warnings: false,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        screw_ie8: true
      },
      output: {
        comments: false,
      },
      test: /bundle.js$/
    }),
    extractCSS
  ],
  devtool: "source-map" 
};

if (process.env.NODE_ENV === "production") {
  config.devtool = "source-map";
}

module.exports = config;