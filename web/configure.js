var path = require('path');

exports.global = function(env, global) {

}

exports.local = function(env, global, local) {
  local.port = global.api.port;
  local.host = global.api.host;
  local.title = 'Todo App (' + env + ')';
  local.homeTemplate = 'home.ejs';
  local.appTemplate = 'app.ejs';
  local.staticCSS = path.join(__dirname, 'css');
}
