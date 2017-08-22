const Koa = require('koa');
const webpack = require('webpack');
const { webpackServer, findCompiler, findStats } = require('..');
const configs = require('../../examples/client-and-server/webpack.config');

describe('src/index.js test suite', () => {
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

  it('should start correctly', () => {
    const compilers = webpack(configs);
    const clientCompiler = findCompiler(compilers, 'client');

    const options = {
      compilers,
      dev: {
        hot: true,
        noInfo: false,
        quiet: true,
        serverSideRender: true,
        publicPath: clientCompiler.options.output.publicPath,
      },
    };

    expect(webpackServer(new Koa(), options)).resolves.toBeDefined();
  });

  it('should/shouldnt find compiler.', () => {
    const compilers = webpack(configs);

    const wrapper = () => {
      findCompiler(compilers, 'no such compiler');
    };
    
    expect(wrapper)
      .toThrow(`No webpack compiler found named 'no such compiler', please check your configuration.`);
    
    expect(findCompiler(compilers, 'server')).toBeDefined();
  });

  it('should throw an error that no stats found', () => {
    const wrapper = new Promise((resolve, reject) => {
      try {
        webpack(configs, (err, stats) => {
          if (err) {
            reject(err);
          } else {
            resolve(stats);
          }
        });
      } catch (err) {
        reject(err);
      }
    });

    return wrapper.then((stats) => {
      const falseName = 'a false name';
      const name = 'client';

      expect(findStats(stats, name)).toBeDefined();
      expect(() => {
        findStats(stats, falseName);
      }).toThrow(`No webpack stats found named '${falseName}', please check your configuration.`);
    }).then(() => {
      // TODO: A better way to kill webpack-hot-middleware
      setInterval(() => {
        process.exit();
      }, 2000);
    });
  });
});
