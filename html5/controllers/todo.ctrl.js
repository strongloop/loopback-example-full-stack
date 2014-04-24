module.exports = TodoCtrl;
var Todo = require('models/todo');
var async = require('async');

function TodoCtrl($scope, $routeParams, $filter) {
	var todos = $scope.todos = [];

	$scope.newTodo = '';
	$scope.editedTodo = null;

	function onChange() {
    Todo.stats(function(err, stats) {
      if(err) return error(err);
      $scope.stats = stats;
    });
    Todo.find(function(err, todos) {
      $scope.todos = todos;
      $scope.$apply();
    });
  }

  onChange();

  function error(err) {
    //TODO error handling
    throw err;
  }

  function errorCallback(err) {
    if(err) error(err);
  }

  Todo.on('changed', onChange);

	// Monitor the current route for changes and adjust the filter accordingly.
	$scope.$on('$routeChangeSuccess', function () {
		var status = $scope.status = $routeParams.status || '';

		$scope.statusFilter = (status === 'active') ?
			{ completed: false } : (status === 'completed') ?
			{ completed: true } : null;
	});

	$scope.addTodo = function () {
		var todo = new Todo({title: $scope.newTodo});
    todo.save(onChange);
    $scope.newTodo = '';
	};

	$scope.editTodo = function (todo) {
		$scope.editedTodo = todo;
		// Clone the original todo to restore it on demand.
		$scope.originalTodo = angular.extend({}, todo);
	};

  $scope.todoCompleted = function(todo) {
    todo.completed = true;
    Todo.upsert(todo, function() {
      onChange();
    });
  }

	$scope.doneEditing = function (todo) {
		$scope.editedTodo = null;
		todo.title = todo.title.trim();

		if (!todo.title) {
			$scope.removeTodo(todo);
		}
	};

	$scope.revertEditing = function (todo) {
		// todos[todos.indexOf(todo)] = $scope.originalTodo;
		// $scope.doneEditing($scope.originalTodo);
	};

	$scope.removeTodo = function (todo) {
    todo = new Todo(todo);
    todo.remove(errorCallback);
	};

	$scope.clearCompletedTodos = function () {
    Todo.destroyAll({where: {completed: true}}, errorCallback);
	};

	$scope.markAll = function (completed) {
    Todo.find(function(err, todos) {
      if(err) return errorCallback(err);
      todos.forEach(function(todo) {
        todo.completed = completed;
        todo.save(errorCallback);
      });
    });
	};
}
