var path = require('path');
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

// boot scripts mount components like REST API
boot(app, __dirname);

// middleware loader - pass the loopack object and the app instance
require(__dirname + '/middleware.js')(loopback, app);

// optionally start the app
app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    console.log('Web server listening at: %s', app.get('url'));
  });
};

if (require.main === module) {
  app.start();
}
