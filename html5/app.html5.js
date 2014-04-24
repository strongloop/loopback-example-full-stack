// dependencies
var LOCAL_CONFIG = require('local.config');
var loopback = require('loopback');
var client = exports.client = loopback();

// angular.js dependencies
require('./bower_components/angular/angular.js');
require('./bower_components/angular-route/angular-route.js');

// data source
var remote = loopback.createDataSource({
  connector: loopback.Remote,
  url: LOCAL_CONFIG.serverInfo.url
});

// models
var User = require('models/user');
var Todo = require('models/todo');
var LocalTodo = Todo.extend('LocalTodo');

// routes
var routes = LOCAL_CONFIG.routes;

// angular dependencies
var dependencies = ['ngRoute'];

// angular app
var app = module.exports = angular.module('app', dependencies);

// setup controllers
// must require controllers in order for browserify
// to include them...
require('./controllers/app.ctrl');
require('./controllers/home.ctrl');
require('./controllers/todo.ctrl');
require('./controllers/user.ctrl');
require('./controllers/login.ctrl');
require('./controllers/register.ctrl');

// attach models to the loopback client
client.model(Todo);
client.model(User);

// setup the model data sources
User.attachTo(remote);
Todo.attachTo(remote);

// setup model replication

// setup routes
Object.keys(routes)
  .forEach(function(route) {
    var routeDef = routes[route];
    var controllerModule = routeDef.controller
      .replace('Ctrl', '.ctrl')
      .toLowerCase();
    var Controller = require('./controllers/' + controllerModule);
    app.controller(Controller.name, Controller);
  });

// config
app
  .config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
    // setup routes
    Object.keys(routes)
      .forEach(function(route) {
        var routeDef = routes[route];
        $routeProvider.when(route, routeDef);
      });
    $routeProvider.otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }]);
