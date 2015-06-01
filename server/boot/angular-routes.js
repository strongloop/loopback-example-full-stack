module.exports = function(app) {
  var routes = require('../../client/ngapp/config/routes');
  Object
    .keys(routes)
    .forEach(function(route) {
      app.get(route, function(req, res) {
        res.sendFile(app.get('indexFile'));
      });
    });
};
