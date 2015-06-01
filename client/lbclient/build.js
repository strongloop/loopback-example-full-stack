var path = require('path');
var pkg = require('./package.json');
var fs = require('fs');
var browserify = require('browserify');
var boot = require('loopback-boot');

module.exports = function buildBrowserBundle(env, callback) {
  var isDevEnv = ~['debug', 'development', 'test'].indexOf(env);
  var b = browserify(
    { basedir: __dirname },
    { // TODO(bajtos) debug should be always true, the sourcemaps should be
      // saved to a standalone file when !isDev(env)
      // TODO(jch) Assess https://github.com/thlorenz/exorcist#usage as an
      // non-dev build extra step for extracting source maps from the bundle
      // after generating it.  Browserify does not seem to have an option for
      // generating them outside the bundle, but this tool is capable of
      // extracting them after-the-fact.
      debug: isDevEnv
    }
  );
  b.require('./' + pkg.main, { expose: 'lbclient' });

  try {
    boot.compileToBrowserify({
      appRootDir: __dirname,
      env: env
    }, b);
  } catch(err) {
    return callback(err);
  }

  var bundlePath = path.resolve(__dirname, 'browser.bundle.js');
  var out = fs.createWriteStream(bundlePath);

  b.bundle()
    .on('error', callback)
    .pipe(out);

  out.on('error', callback);
  out.on('close', callback);
};
