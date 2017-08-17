'use strict';

const requireFromString = require('require-from-string');
const devMiddleware = require('./src/dev');
const hotMiddleware = require('./src/hot');

let init = false;
let cache;

const findCompiler = (compilers, name) => {
  const find = (compilers, name) => {
    if (compilers && Array.isArray(compilers.compilers)) {
      return compilers.compilers.find(compiler => compiler.name === name);
    } else if (compilers && compilers.name === name) {
      return compilers;
    } else {
      return null;
    }
  };
  const compiler = find(compilers, name);

  if (!compiler) {
    throw new Error(`No webpack compiler found named '${serverName}', please check your webpack configuration.`)
  } else {
    return compiler;
  }
};

/**
 * register webpack 'done' event listener
 * @param {*} compilers server and client webpack compilers
 * @param {*} serverName server compiler name
 */
const listen = (compilers, serverName) => {
  return new Promise((resolve, reject) => {
    compilers.plugin('done' , () => {
      const serverCompiler = findCompiler(compilers, serverName);
      const middlewares = handleChanges(serverCompiler);
      resolve({ middlewares });
    });
    compilers.plugin('failed', (err) => {
      reject(err);
    });
  });
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

exports.findCompiler = findCompiler;

exports.webpackServer = (app, options) => {
  const { compilers, serverName, clientName, dev, hot, server } = options;

  const serverNameOption = serverName || 'server';
  const clientNameOption = clientName || 'client';
  const devOptions = dev || {};
  const hotOptions = hot || {};
  const serverOptions = server;

  const serverCompiler = findCompiler(compilers, clientNameOption);

  app.use(devMiddleware(compilers, devOptions));
  app.use(hotMiddleware(serverCompiler, hotOptions));

  if (!serverOptions || !serverOptions.use) {
    return new Promise((resolve, reject) => {
      listen(compilers, serverNameOption).then(({ middlewares }) => {
        resolve({ middlewares });
      }).catch((err) => {
        reject(err);
      });
    });
  }
};
