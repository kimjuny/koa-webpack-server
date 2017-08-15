# Koa Webpack Server

> koa2、webpack、hmr、isomorphic、server-side-render

Koa-Webpack-Server is a all-in-one environment for Koa2 and webpack2/3 development. This package contains three components: a koa-middleware for [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)、a koa-middleware for [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware)、a promise-based entry for hot koa-middleware development(something like [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware) yet much more powerful).

This package is usually used to build a universal/isomorphic SPA application(react、vue、angular) which uses koa and webpack as setback. Complete examples see:

* [koa-react-universal](https://github.com/kimjuny/koa-react-universal)

> Noted: This package is still on early stage.

### Install

```
yarn add koa-webpack-server --dev
```

### Usage

```javascript
const Koa = require('koa');
const webpack = require('webpack');
const webpackServer = require('koa-webpack-server');
const configs = require('../config/webpack.dev.config');

const app = new Koa();

const options = {
  compilers: webpack(configs),
  dev: {
    noInfo: false,
    quiet: false,
    serverSideRender: true,
  },
};

webpackServer(app, options).then(({ middlewares }) => {
  // Middlewares are all hot-loaded.
  // You can make any changes from middlewares and it will automatically re-webpacking and reload.
  const { logger, render } = middlewares;

  app.use(logger);
  app.use(render);

  app.listen(3000, () => {
    console.log('server started at port 3000');
  });
}).catch((err) => {
});

```

For more information please refer to [examples](https://github.com/kimjuny/koa-webpack-server/tree/master/examples/client-and-server).

### API

#### webpackServer: {Function(app: Koa, options: Object):Promise}

#### options: Object

```javascript
const options = {
  compilers: Object, // [Required] webpack compiler
  dev: Object,       // webpack-dev-middleware options
  hot: Object,       // webpack-hot-middleware options
  server: Object,    // hot server options
}
```

#### dev: Object

[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware) options.

#### hot: Object

[webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware) options.

#### server: Object

```javascript
const server = {
  use: Boolean,      // use hot development middleware? default is true
}
```
