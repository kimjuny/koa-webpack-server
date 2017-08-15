require('babel-polyfill');
const Koa = require('koa');
const webpack = require('webpack');
// const webpackServer = require('koa-webpack-server');
const webpackServer = require('../../../../index');
const configs = require('../../webpack.config');

const app = new Koa();

const options = {
  compilers: webpack(configs),
  dev: {
    noInfo: false,
    quiet: true,
    serverSideRender: true,
  },
};

webpackServer(app, options).then(({ middlewares }) => {
  const { logger, renderer } = middlewares;

  // apply middlewares
  app.use(logger);
  app.use(renderer);

  // start listening
  app.listen(3000, () => {
    console.log('server started at port 3000');
  });
}).catch((err) => {
  console.error(err);
});
