require('babel-polyfill');
const Koa = require('koa');
const webpack = require('webpack');
// const { webpackServer, findCompiler } = require('koa-webpack-server');
const { webpackServer, findCompiler } = require('../../../../index');
const configs = require('../../webpack.config');

const app = new Koa();

const compilers = webpack(configs);

const clientCompiler = findCompiler(compilers, 'client');

const options = {
  compilers,
  dev: {
    hot: true,
    noInfo: false,
    quiet: false,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true,
    },
    serverSideRender: true,
    publicPath: clientCompiler.options.output.publicPath,
    stats: {
      colors: true,
    },
  },
};

webpackServer(app, options).then(({ middlewares }) => {
  const { logger, render } = middlewares;

  // apply middlewares
  app.use(logger);
  app.use(render);

  // start listening
  app.listen(3000, () => {
    console.log('server started at port 3000');
  });
}).catch((err) => {
  console.error(err);
});
