## Koa-Webpack-Server

> koa2、webpack、hmr、isomorphic、server-side-render

This package is still on early stage, APIs may have break changes in the near future, so...

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
  // middlewares are all hot
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
