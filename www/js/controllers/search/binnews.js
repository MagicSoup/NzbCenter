var mainModule = angular.module('mainModule');

mainModule.controller('searchWithBinnewsCtrl', [
    '$scope',
    '$controller',
    'searchBinnewsService',
    function ($scope,
              $controller,
              searchBinnewsService) {
      'use strict';
      $controller('abstractSearchCtrl', {$scope: $scope});

      $scope.categories = searchBinnewsService.getCategories();
      $scope.selectedCategory;

      $scope.submitSearch = function () {
      };
    }]
);
