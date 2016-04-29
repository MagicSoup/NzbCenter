var mainModule = angular.module('mainModule');

mainModule.controller('searchWithBinnewsCtrl', [
    '$scope',
    '$controller',
    '$state',
    '$ionicPopover',
    'searchBinnewsService',
    'binnewsCategoryEndpoint',
    function ($scope,
              $controller,
              $state,
              $ionicPopover,
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
        searchBinnewsService.loadCategory(binnewsCategoryEndpoint.url, newValue.categoryId)
          .then(function (datas) {
            $scope.datas = datas;
            //TODO parse description to remove useless informations
            $scope.isFullyLoaded = true;
            $scope.splashScreenHide();
          });
      };

      $scope.onCategoryReset = function () {
        $scope.displayedCategoryMessage = $scope.defaultMessage;
      };

      $scope.searchWithNzbsu = function (data) {
        $scope.searchQuery = extractFileName(data);
        $state.go('app.searchWithNzbsu', {query: $scope.searchQuery});
      };

      function extractFileName(data) {
        var descriptionArray = data.description.split('<br>');
        var fileNameContent = descriptionArray[3];
        fileNameContent = fileNameContent.split(':')[1].trim();
        return fileNameContent;
      };

      var searchTemplate =
        '<ion-popover-view style="height: 55px;">' +
        '<ion-content>' +
        '<div class="list">' +
        '<a class="item" ng-click="searchWithNzbsu(selectedData)" ng-show="config.nzbget.activated">Chercher avec Nzb.su</a>' +
        '</div>' +
        '</ion-content>' +
        '</ion-popover-view>';

      $scope.searchPopover = $ionicPopover.fromTemplate(searchTemplate, {
        scope: $scope
      });

      $scope.openSearchPopover = function ($event, data) {
        $scope.searchPopover.show($event);
        $scope.selectedData = data;
      };

      $scope.closeSearchPopover = function () {
        $scope.searchPopover.hide();
      };

      $scope.$on('$destroy', function () {
        $scope.searchPopover.remove();
      });
    }]
);
