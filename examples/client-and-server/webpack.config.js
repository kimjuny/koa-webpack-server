const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const externals = fs
  .readdirSync(path.resolve(__dirname, './node_modules'))
  .filter(x => !/\.bin/.test(x))
  .reduce((externals, mod) => {
    externals[mod] = `commonjs ${mod}`
    return externals
  }, {});

externals['react-dom/server'] = 'commonjs react-dom/server';

module.exports = [
  {
    name: 'client',
    target: 'web',
    entry: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=false',
      path.resolve(__dirname, './app/client/index.js'),
    ],
    output: {
      filename: 'client.js',
      publicPath: '/static/',
    },
    module: {
      rules: [
        {
          test: /.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
    ],
  }, {
    name: 'server',
    target: 'node',
    entry: [
      'babel-polyfill',
      path.resolve(__dirname, './app/server/middlewares.js'),
    ],
    output: {
      filename: 'middlewares.js',
      path: path.resolve(__dirname, './build/server'),
      publicPath: '/build/server/',
      libraryTarget: 'commonjs2',
    },
    module: {
      rules: [
        {
          test: /.js$/,
          loader: 'babel-loader',
        },
      ],
    },
    externals,
    plugins: [
    ],
  }
];
