var mainModule = angular.module('mainModule');

mainModule.controller('searchWithBinnewsCtrl', [
    '$scope',
    '$controller',
    '$state',
    '$ionicPopover',
    'binnewsService',
    'binnewsCategoryEndpoint',
    function ($scope,
              $controller,
              $state,
              $ionicPopover,
              binnewsService,
              binnewsCategoryEndpoint) {
      'use strict';
      $controller('abstractSearchCtrl', {$scope: $scope});

      $scope.defaultMessage = "Sélectionner une catégorie";
      $scope.categories = binnewsService.getCategories();
      $scope.displayedCategoryMessage = $scope.defaultMessage;
      $scope.selectedCategory = {};

      $scope.onCategorySelect = function (newValue, oldValue) {
        $scope.splashScreenShow();
        $scope.displayedCategoryMessage = newValue.categoryName;
        $scope.selectedCategory = newValue;
        binnewsService.loadCategory(binnewsCategoryEndpoint.url, newValue.categoryId)
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
        $scope.searchPopover.hide();
        $scope.searchQuery = extractFileName(data);
        $state.go('app.searchWithNzbsu', {query: $scope.searchQuery});
      };

      $scope.searchWithFindNzb = function (data) {
        $scope.searchPopover.hide();
        $scope.searchQuery = extractFileName(data);
        $state.go('app.searchWithFindnzb', {query: $scope.searchQuery});
      };

      $scope.searchWithNzbclub = function (data) {
        $scope.searchPopover.hide();
        $scope.searchQuery = extractFileName(data);
        $state.go('app.searchWithNzbclub', {query: $scope.searchQuery});
      };

      function extractFileName(data) {
        var descriptionArray = data.description.split('<br>');
        var fileNameContent = descriptionArray[3];
        fileNameContent = fileNameContent.split(':')[1].trim();
        return fileNameContent;
      };

      var searchTemplate =
        '<ion-popover-view style="height: 165px;">' +
        '<ion-content>' +
        '<div class="list">' +
        '<a class="item" ng-click="searchWithNzbsu(selectedData)" ng-show="config.apikey.activated && config.apikey.nzbsu != \'\'">Chercher avec Nzb.su</a>' +
        '<a class="item" ng-click="searchWithFindNzb(selectedData)" ng-show="config.searchengine.findnzb.activated">Chercher avec Findnzb</a>' +
        '<a class="item" ng-click="searchWithNzbclub(selectedData)" ng-show="config.searchengine.nzbclub.activated">Chercher avec Nzbclub</a>' +
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
