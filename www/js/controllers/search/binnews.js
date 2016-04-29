var mainModule = angular.module('mainModule');

mainModule.controller('searchWithBinnewsCtrl', [
    '$scope',
    '$controller',
    '$state',
    'searchBinnewsService',
    'binnewsCategoryEndpoint',
    function ($scope,
              $controller,
              $state,
              searchBinnewsService,
              binnewsCategoryEndpoint) {
      'use strict';
      $controller('abstractSearchCtrl', {$scope: $scope});

      $scope.defaultMessage = "Sélectionner une catégorie";
      $scope.categories = searchBinnewsService.getCategories();
      $scope.displayedCategoryMessage = $scope.defaultMessage;
      $scope.selectedCategory = {};

      $scope.onCategorySelect = function (newValue, oldValue) {
        $scope.splashScreenShow();
        $scope.displayedCategoryMessage = newValue.categoryName;
        $scope.selectedCategory = newValue;
        //$state.go('app.searchWithNzbsu', {query: 'Linux'});
        searchBinnewsService.loadCategory(binnewsCategoryEndpoint.url, newValue.categoryId)
          .then(function (datas) {
            $scope.datas = datas;
            $scope.isFullyLoaded = true;
            $scope.splashScreenHide();
          });
      };

      $scope.onCategoryReset = function () {
        $scope.displayedCategoryMessage = $scope.defaultMessage;
      };
    }]
);
