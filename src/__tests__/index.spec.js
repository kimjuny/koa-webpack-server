const Koa = require('Koa');
const webpack = require('webpack');
const { webpackServer, findCompiler } = require('../index.js');
const configs = require('../../examples/client-and-server/webpack.config.js');

describe('src/index.js test suite', () => {
  it('should start correctly', () => {
    const compilers = webpack(configs);
    const clientCompiler = findCompiler(compilers, 'client');

    const options = {
      compilers,
      dev: {
        hot: true,
        noInfo: false,
        quiet: true,
        serverSideRender: true,
        publicPath: clientCompiler.options.output.publicPath,
      },
    };

    const defer = webpackServer(new Koa(), options);

    expect(defer).resolves.toBeDefined();
  });
});
