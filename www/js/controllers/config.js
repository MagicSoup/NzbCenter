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
    function ($rootScope,
              $scope,
              $controller,
              $ionicPlatform,
              Loki,
              loggerService,
              configService,
              nzbgetService,
              sabnzbdService) {
      'use strict';
      $controller('abstractDefaultCtrl', {$scope: $scope});

      $scope.config = {};

      $ionicPlatform.ready(function () {
        configService.initDB();
        configService.getActualConfig().then(function (actualConfig) {
          $scope.config = actualConfig;
        });
      });

      $scope.submitConfig = function () {
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
          .then(
          function (datas) {
            var version = extractNzbgetServerVersion(datas.data.result);
            loggerService.log(' Version => ' + version);
            if ((typeof version != 'undefined')) {
              $scope.displayMessage('La connexion à Nzbget ' + version + ' est correctement configuré.');
            }
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
          .then(
          function (resp) {
            var version = resp.data.version;
            loggerService.log(' Version => ' + version);
            if ((typeof version != 'undefined')) {
              $scope.displayMessage('La connexion à Sabnzbd ' + version + ' est correctement configuré.');
            }
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
