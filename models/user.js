var loopback = require('loopback');

var User = module.exports = loopback.User.extend('User', {
  title: String,
  done: {type: Boolean, default: false}
});
