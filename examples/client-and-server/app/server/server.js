require('babel-polyfill');
const Koa = require('koa');
const koaWebpack = require('koa-webpack');
const webpack = require('webpack');
const webpackServer = require('../../../../src/index');
const configs = require('../../webpack.config');

console.log('webpack now compiling...');
const compiler = webpack(configs);

const app = new Koa();

app.use(koaWebpack({
  compiler,
  dev: {
    noInfo: false,
    quiet: true,
    publicPath: '/build/client/',
  },
}));

webpackServer(compiler).then(({ logger, renderer }) => {
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
