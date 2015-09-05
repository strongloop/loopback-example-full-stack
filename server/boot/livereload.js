'use strict';

module.exports = function(app) {
  var livereload = app.get('livereload');
  if (!livereload) return;

  app.middleware('routes:before', require('connect-livereload')({
    port: livereload
  }));
};
