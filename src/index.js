'use strict';

const requireFromString = require('require-from-string');

let init = false;
let cache; 

const findServerCompiler = (compilers) => {
  return compilers.compilers.find(compiler => compiler.name === 'server');
};

const findServerStats = (stats) => {
  return stats.stats.find(stat => stat.name === 'server');
}

/**
 * register webpack 'done' event listener
 * @param {*} compiler
 */
const listen = (compilers) => {
  return new Promise((resolve, reject) => {
    compilers.plugin('done' , (stats) => {
      const serverCompiler = findServerCompiler(compilers);
      const serverStats = findServerStats(stats);
      const result = handleChanges(serverCompiler, serverStats);
      resolve(result);
    });
    compilers.plugin('failed', (err) => {
      reject(err);
    });
  })
};

/**
 * handles webpack build stats
 * @param {*} compiler 
 * @param {*} stats 
 */
const handleChanges = (compiler, stats) => {
  const result = {};

  const outputFileSystem = compiler.outputFileSystem;
  const outputPath = compiler.outputPath;
  const filename = compiler.options.output.filename || 'main.js';
  const file = `${outputPath}/${filename}`;

  const buffer = outputFileSystem.readFileSync(file);
  cache = requireFromString(buffer.toString());

  if (!init) {
    Object.keys(cache).forEach((key) => {
      if (typeof cache[key] === 'function') {
        result[key] = async function() {
          await cache[key](...arguments);
        };
      } else {
        result[key] = cache[key];
      }
    });
    init = true;
  }

  return result;
}

const webpackServer = (compilers, options) => {
  return new Promise((resolve, reject) => {
    listen(compilers).then((result) => {
      resolve(result);
    }).catch((err) => {
      reject(err);
    });
  });
};

module.exports = webpackServer;
