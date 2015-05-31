var path = require('path');

module.exports = function (loopback, app) {

  app.middleware('initial:before', loopback.compress());
  app.middleware('initial:before', loopback.static(path.dirname(app.get('indexFile'))));

  var livereload = app.get('livereload');
  if (livereload) {
    app.middleware('initial:before', require('connect-livereload')({
      port: livereload
    }));
  }

  // Requests that get this far won't be handled
  // by any middleware. Convert them into a 404 error
  // that will be handled later down the chain
  app.middleware('final', function () {
    loopback.urlNotFound();
  });

  // The ultimate error handler
  app.middleware('final:after', function () {
    loopback.errorHandler();
  });

}
