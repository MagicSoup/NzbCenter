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

      $scope.categories = [];
      $scope.defaultMessage = "Sélectionner une catégorie";
      $scope.displayedCategoryMessage = $scope.defaultMessage;
      $scope.selectedCategory = {};

      function isInArray(item, array) {
        return (-1 !== array.indexOf(item));
      };

      $scope.getCategories = function (config) {
        var selectedCategoryIds = config.binnews.categories.split(';');
        var categories = [];
        angular.forEach(binnewsService.getCategories(), function (category) {
          var isChecked = isInArray(category.categoryId.toString(), selectedCategoryIds);
          if (isChecked) {
            categories.push(category);
          }
        });
        return categories;
      };

      $scope.$on("config:loaded", function (event, config) {
        $scope.categories = $scope.getCategories(config);
      });

      $scope.onCategorySelect = function (newValue, oldValue) {
        $scope.splashScreenShow();
        $scope.displayedCategoryMessage = newValue.categoryName;
        $scope.selectedCategory = newValue;
        binnewsService.loadCategory(binnewsCategoryEndpoint.url, newValue.categoryId)
          .then(function (datas) {
            var temporaryDatas = [];
            angular.forEach(datas, function (data) {
              var extractedDescriptions = extractDescriptionContent(data.description);
              var updatedData = {source: data, content: extractedDescriptions}
              temporaryDatas.push(updatedData);
            });
            $scope.datas = temporaryDatas;
            $scope.isFullyLoaded = true;
            $scope.splashScreenHide();
          });
      };

      function extractDescriptionContent(description) {
        var descriptions = description.split('<br>');
        var descriptionMap = {};
        angular.forEach(descriptions, function (description) {
          var key = description.split(':')[0];
          var value = description.split(':')[1];
          if(key != 'undefined' && key.trim() != '' && !key.trim().startsWith('<a')){
            descriptionMap[key.trim()] = value.trim();
          }
        });

        var description = {
          fileName: descriptionMap["Nom du fichier"],
          category: descriptionMap["Catégorie"],
          newsgroup: descriptionMap["Newsgroup"],
          subCategory: descriptionMap["Sous-Catégorie"],
          language: descriptionMap["Langue"],
          highQuality: descriptionMap["Résolution HD"],
          size: descriptionMap["Taille"]
        };
        return description;
      }

      $scope.onCategoryReset = function () {
        $scope.displayedCategoryMessage = $scope.defaultMessage;
      };

      $scope.searchWithNzbsu = function (data) {
        $scope.searchPopover.hide();
        $state.go('app.searchWithNzbsu', {query: data.content.fileName});
      };

      $scope.searchWithFindNzb = function (data) {
        $scope.searchPopover.hide();
        $state.go('app.searchWithFindnzb', {query: data.content.fileName});
      };

      $scope.searchWithNzbclub = function (data) {
        $scope.searchPopover.hide();
        $state.go('app.searchWithNzbclub', {query: data.content.fileName});
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
