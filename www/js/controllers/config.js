var mainModule = angular.module('mainModule');

mainModule.controller('configCtrl', [
    '$rootScope',
    '$scope',
    '$controller',
    '$ionicPlatform',
    'Loki',
    'loggerService',
    'configService',
    'nzbgetService',
    'sabnzbdService',
    'binnewsService',
    function ($rootScope,
              $scope,
              $controller,
              $ionicPlatform,
              Loki,
              loggerService,
              configService,
              nzbgetService,
              sabnzbdService,
              binnewsService) {
      'use strict';
      $controller('abstractDefaultCtrl', {$scope: $scope});

      $scope.filterCategoryText = 'Filtrer les catégories';
      $scope.categories = [];
      $scope.config = {};

      $ionicPlatform.ready(function () {
        configService.initDB();
        configService.getActualConfig()
          .then(function (actualConfig) {
            $scope.config = actualConfig;
            $scope.categories = $scope.getCategories();
          });
      });

      function isInArray(item, array) {
        return (-1 !== array.indexOf(item));
      };

      $scope.getCategories = function () {
        var selectedCategoryIds = [];
        var categories = [];

        if(
          (typeof $scope.config.binnews) != 'undefined' &&
          (typeof $scope.config.binnews.categories) != 'undefined'){
          selectedCategoryIds = $scope.config.binnews.categories.split(';');
        }

        angular.forEach(binnewsService.getCategories(), function (category) {
          var categoryId = category.categoryId.toString();
          var isChecked = isInArray(categoryId, selectedCategoryIds);
          var item = {id: categoryId, text: category.categoryName, checked: isChecked, icon: null};
          categories.push(item);
        });

        return categories;
      };

      $scope.submitConfig = function () {
        if ($scope.config.sabnzbd.activated) {
          $scope.config.sabnzbd.checked = false;
          sabnzbdService.getServerVersion($scope.config.sabnzbd)
            .then(function (resp) {
              var version = resp.data.version;
              $scope.config.sabnzbd.version = version;
              $scope.config.sabnzbd.checked = true;
            })
            .catch(function (error) {
              $scope.displayWarningMessage('Attention la configuration car la connexion à Sabnzbd n\'est pas correcte.');
            });
        }

        if ($scope.config.nzbget.activated) {
          $scope.config.nzbget.checked = false;
          nzbgetService.getServerConfig($scope.config.nzbget)
            .then(
            function (resp) {
              var version = extractNzbgetServerVersion(resp.data.result);
              $scope.config.nzbget.version = version;
              $scope.config.nzbget.checked = false;
            })
            .catch(function (error) {
              $scope.displayWarningMessage('Attention la configuration car la connexion à Nzbget n\'est pas correcte.');
            })
        }

        if (typeof $scope.config.$loki != 'undefined') {
          configService.updateConfig($scope.config);
        } else {
          configService.addConfig($scope.config);
        }
        $rootScope.$broadcast('config:updated', $scope.config);
        $scope.displayMessage('La configuration a été correctement sauvegardée.');
      };

      $scope.testNzbgetConfig = function () {
        loggerService.turnOn();
        nzbgetService.getServerConfig($scope.config.nzbget)
          .then(function (resp) {
            var version = extractNzbgetServerVersion(resp.data.result);
            $scope.displayMessage('La connexion à Nzbget ' + version + ' est correctement configuré.');
          })
          .catch(function (error) {
            var errorMessage = (error.data == '') ? error.statusText : error.data;
            $scope.displayErrorMessage('La connexion à Nzbget est incorrectement configuré. Raison (Status ' + error.status + ' : ' + errorMessage + ')');
          })
        ;
      };

      $scope.testSabnzbdConfig = function () {
        loggerService.turnOn();
        sabnzbdService.getServerVersion($scope.config.sabnzbd)
          .then(function (resp) {
            var version = resp.data.version;
            $scope.displayMessage('La connexion à Sabnzbd ' + version + ' est correctement configuré.');
          })
          .catch(function (error) {
            var errorMessage = (error.data == '') ? error.statusText : error.data;
            $scope.displayErrorMessage('La connexion à Sabnzbd est incorrectement configuré. Raison (Status ' + error.status + ' : ' + errorMessage + ')');
          })
        ;
      };

      function extractNzbgetServerVersion(datas) {
        var version = null;
        angular.forEach(datas, function (data) {
          if (data.Name == 'Version') {
            version = data.Value;
          }
        });
        return version;
      }

      //TODO add some function used to test the connection to the service

    }
  ]
);
