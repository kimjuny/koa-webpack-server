const hotMiddleware = require('webpack-hot-middleware');
const { PassThrough } = require('stream');

module.exports = (compiler, opts) => {
  const expressMiddleware = hotMiddleware(compiler, opts);
  return async (ctx, next) => {
    let stream = new PassThrough();

    await expressMiddleware(ctx.req, {
      write: stream.write.bind(stream),
      writeHead: (status, headers) => {
        ctx.body = stream;
        ctx.status = status;
        ctx.set(headers);
      },
    }, next);
  };
}
