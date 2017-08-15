const path = require('path');

module.exports = {
  name: 'webpack-build',
  target: 'node',
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'commonjs2',
  },
};
