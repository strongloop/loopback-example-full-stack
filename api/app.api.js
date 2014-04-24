// dependencies
var path = require('path');
var loopback = require('loopback');
var explorer = require('loopback-explorer');
var CONFIG = require('global.config');
var LOCAL_CONFIG = require('local.config');

// server
var server = module.exports = loopback();

// data source
var db = loopback.createDataSource(LOCAL_CONFIG.db);

// models
var User = require('models/user');
var Todo = require('models/todo');

// setup the model data sources
User.attachTo(db);
Todo.attachTo(db);
server.model(User);
server.model(Todo);

// root api path
var apiPath = CONFIG.api.root;

// enable authentication
// server.enableAuth();

// middleware
server.use(loopback.token());
server.use(apiPath, loopback.rest());
server.use('/explorer', explorer(server, {basePath: apiPath}));
