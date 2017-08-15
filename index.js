'use strict';

const requireFromString = require('require-from-string');
const devMiddleware = require('./src/dev');
const hotMiddleware = require('./src/hot');

let init = false;
let cache;

const findServerCompiler = (compilers) => {
  if (compilers && Array.isArray(compilers.compilers)) {
    return compilers.compilers.find(compiler => compiler.name === 'server');
  } else if (compilers && compilers.name === 'server') {
    return compilers;
  }
  return undefined;
};

/**
 * register webpack 'done' event listener
 * @param {*} compiler
 */
const listen = (compilers) => {
  return new Promise((resolve, reject) => {
    compilers.plugin('done' , () => {
      const serverCompiler = findServerCompiler(compilers);
      const middlewares = handleChanges(serverCompiler);
      resolve({ middlewares });
    });
    compilers.plugin('failed', (err) => {
      reject(err);
    });
  })
};

/**
 * handles webpack build changes
 * @param {*} compiler
 */
const handleChanges = (compiler) => {
  const middlewares = {};

  const outputFileSystem = compiler.outputFileSystem;
  const outputPath = compiler.outputPath;
  const filename = compiler.options.output.filename || 'main.js';
  const file = `${outputPath}/${filename}`;

  const buffer = outputFileSystem.readFileSync(file);
  cache = requireFromString(buffer.toString());

  if (!init) {
    Object.keys(cache).forEach((key) => {
      if (typeof cache[key] === 'function') {
        middlewares[key] = async function() {
          await cache[key](...arguments);
        };
      } else {
        middlewares[key] = cache[key];
      }
    });
    init = true;
  }

  return middlewares;
}

const webpackServer = (app, options) => {
  const { compilers, dev, hot, server } = options;

  const devOptions = dev || {};
  const hotOptions = hot || {};
  const serverOptions = server;

  app.use(devMiddleware(compilers, devOptions));
  app.use(hotMiddleware(compilers, devOptions));

  if (!serverOptions || !serverOptions.use) {
    return new Promise((resolve, reject) => {
      listen(compilers).then(({ middlewares }) => {
        resolve({ middlewares });
      }).catch((err) => {
        reject(err);
      });
    });
  }
};

module.exports = webpackServer;
