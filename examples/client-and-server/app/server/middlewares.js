import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../client/App';
import _ from 'lodash';

export const logger = async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log(`[${ctx.method}][${ms}ms] ${ctx.url}`);
};

export const render = async (ctx, next) => {
  const content = renderToString(<App />);
  ctx.set('Content-Type', 'text/html');
  ctx.body = `
    <!doctype html>
    <html>
      <head>
        <title>client-and-server</title>
      </head>
      <body>
        <div id="root">${content}</div>
        <script src="/static/client.js" defer="defer"></script>
      </body>
    </html>
  `;
};
