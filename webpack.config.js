'use strict';
const webpack = require('webpack');

const config = {
  context: __dirname + '/src',
  entry: {
    app: './js/app.module.js',
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    publicPath: "/assets/",
    devtoolLineToLine: true
  },
  resolve: {
      alias: {

      }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          { loader: 'ng-annotate-loader' },
          {
            loader: 'babel-loader',
            options: { presets: ['es2015'] }
          }
        ]
      },
      {
        test: /\.(less|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ]
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

  devtool: "source-map" 
};

if (process.env.NODE_ENV === "production") {
  config.devtool = "source-map";
}

module.exports = config;