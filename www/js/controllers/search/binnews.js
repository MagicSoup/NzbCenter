var mainModule = angular.module('mainModule');

mainModule.controller('searchWithBinnewsCtrl', function ($scope, $controller) {
  'use strict';
  $controller('abstractSearchCtrl', {$scope: $scope});
  $scope.someFunction = function () {
  };
});
