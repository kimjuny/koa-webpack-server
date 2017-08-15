export const logger = async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log(`[${ctx.method}][${ms}ms] ${ctx.url}`);
};

export const renderer = async (ctx, next) => {
  ctx.set('Content-Type', 'text/html');
  ctx.body = `
    <!doctype html>
    <html>
      <head>
        <title>client-and-server</title>
      </head>
      <body>
        <div>Hello World.</div>
      </body>
    </html>
  `;
};
