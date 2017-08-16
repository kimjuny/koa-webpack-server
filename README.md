# Koa Webpack Server

> koa2、webpack、hmr、isomorphic、server-side-render

Koa-Webpack-Server is all-in-one environment for koa2 and webpack2/3 development. This package contains three components: a koa-middleware for [webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)、a koa-middleware for [webpack-hot-middleware](https://github.com/glenjamin/webpack-hot-middleware)、a promise-based entry for hot koa-middleware development(something like [webpack-hot-server-middleware](https://github.com/60frames/webpack-hot-server-middleware) yet more powerful).

This package is usually used to build a universal/isomorphic SPA application(react、vue、angular) which uses koa and webpack as setback, making universal/isomorphic development super easy.

For complete examples please refer to:

* [koa-react-universal](https://github.com/kimjuny/koa-react-universal)

> Noted: This package is still on early stage.

### Install

```
yarn add koa-webpack-server --dev
```

### Usage

server.js

```javascript
const Koa = require('koa');
const webpack = require('webpack');
const webpackServer = require('koa-webpack-server');
const configs = require('../config/webpack.dev.config');
// 👆 array of webpack configurations(client and server)

const app = new Koa();

const options = {
  compilers: webpack(configs),
  dev: {
    noInfo: false,
    quiet: false,
    serverSideRender: true,
  },
};

// wire webpack-dev-middleware、webpack-hot-middleware to app and start webpack-hot-server
webpackServer(app, options).then(({ middlewares }) => {
  // hot-middlewares: you may try making any changes from middlewares,
  // it will automatically rebuild and reload,
  // so that you don't have to reboot your server to see the changes.
  const { logger, render } = middlewares;

  app.use(logger);
  app.use(render);

  app.listen(3000, () => {
    console.log('server started at port 3000');
  });
}).catch((err) => {
});
```

middlewares.js

```javascript
// all middlewares are 'AsyncFunction's
const logger = async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log(`[${ctx.method}][${ms}ms] ${ctx.url}`);
}

export logger;

// you may try making any changes in middlewares, for example,
// change 'Hello World.' to 'Hello World!' and see what's happening.
const render = async (ctx, next) => {
  ctx.body = `
    <!doctype html>
    <html>
      <head><title>koa-webpack-server</title></head>
      <body><div>Hello World.</div></body>
    </html>
  `;
  await next();
}

export render;

```

For usage detail please refer to [basic examples](https://github.com/kimjuny/koa-webpack-server/tree/master/examples).

### API

#### webpackServer: {Function(app: Koa, options: Object):Promise}

#### options: Object

```javascript
const options = {
  compilers: Object,  // [Required] webpack compiler
  serverName: String, // webpack server config name, default 'server'
  dev: Object,        // webpack-dev-middleware options
  hot: Object,        // webpack-hot-middleware options
  server: Object,     // hot server options
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

### License

MIT

### Contributing
