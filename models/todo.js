var loopback = require('loopback');
var async = require('async');

var Todo = module.exports = loopback.DataModel.extend('Todo', {
  title: String,
  completed: {type: Boolean, default: false}
});

Todo.stats = function(filter, cb) {
  var stats = {};

  async.parallel([
    countComplete,
    count
  ], function(err) {
    if(err) return cb(err);
    stats.remaining = stats.total - stats.completed;
    cb(null, stats);
  });

  function countComplete(cb) {
    Todo.count({where: {completed: true}}, function(err, count) {
      stats.completed = count;
      cb(err);
    });
  }

  function count(cb) {
    Todo.count(function(err, count) {
      stats.total = count;
      cb(err);
    });
  }
}

loopback.remoteMethod(Todo.stats, {
  accepts: {arg: 'filter', type: 'object'},
  returns: {arg: 'stats', type: 'object'}
});
