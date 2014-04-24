var gulp = require('gulp');
var path = require('path');
var pkg = require('./package.json');
var fs = require('fs');
var browserify = require('browserify');
var sh = require('shelljs');

exports.global = function(env, global) {
  // routes
  global.routes = {
    '/': {
      controller: 'HomeCtrl',
      templateUrl: '/views/welcome.html'
    },
    '/me': {
      controller: 'UserCtrl',
      templateUrl: '/views/me.html',
    },
    '/my/todos': {
      controller: 'TodoCtrl',
      templateUrl: '/views/todos.html'
    },
    '/login': {
      controller: 'LoginCtrl',
      templateUrl: '/views/login.html'
    },
    '/register': {
      controller: 'RegisterCtrl',
      templateUrl: '/views/register.html'
    }
  };

  global.bundle = 'bundle.' + pkg.version;
  if(!isDev(env)) global.bundle += '.min';
  global.bundle += '.js';
  global.html5Views = path.join(__dirname, 'views');
  global.html5Bundle = path.join(__dirname, 'build', global.bundle);
  global.bundleURL = '/' + global.bundle;
}

exports.local = function configure(env, global, local) {
  // NOTE: this config will be available in the browser
  local.serverInfo = {
    api: global.api,
    url: global.api.protocol
        + '://'
        + global.api.host
        + ':'
        + global.api.port
        + global.api.root
  };
  local.routes = global.routes;
}

exports.build = function(env, global, local, cb) {
  var b = browserify({basedir: __dirname});
  b.add('./' + pkg.main);

  var bundleDir = path.dirname(global.html5Bundle);
  if (!fs.existsSync(bundleDir))
    fs.mkdirSync(bundleDir);

  var out = fs.createWriteStream(global.html5Bundle);

  if(!isDev(env)) {
    b.transform({
      global: true
    }, 'uglifyify');
  }

  b.bundle().pipe(out);

  out.on('error', cb);
  out.on('close', cb);
}

function isDev(env) {
  return ~['debug', 'development', 'test'].indexOf(env);
}
