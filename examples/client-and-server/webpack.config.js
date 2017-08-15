const path = require('path');
const webpack = require('webpack');

module.exports = [
  {
    name: 'client',
    entry: [
      path.resolve(__dirname, './app/client/index.js'),
    ],
    output: {
      filename: 'client.js',
      path: path.resolve(__dirname, './build/client'),
      publicPath: '/build/client/',
    },
    module: {
      rules: [
        {
          test: /.js$/,
          loader: 'babel-loader',
          options: {
            presets: [
              'react', 'es2015', 'stage-0',
            ],
          },
        },
      ],
    },
  }, {
    name: 'server',
    target: 'node',
    entry: [
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
          options: {
            presets: [
              'react', 'es2015', 'stage-0',
            ],
            plugins: [
              'transform-async-to-generator',
            ],
          },
        },
      ],
    },
    plugins: [
    ],
  }
];
