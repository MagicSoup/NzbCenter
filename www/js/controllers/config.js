var mainModule = angular.module('mainModule');

mainModule.controller('configCtrl', [
    '$rootScope',
    '$scope',
    '$controller',
    '$ionicPlatform',
    'Loki',
    'base64',
    'loggerService',
    'configService',
    'nzbgetService',
    'sabnzbdService',
    function ($rootScope,
              $scope,
              $controller,
              $ionicPlatform,
              Loki,
              base64,
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
        var basicAuth = base64.encode($scope.config.nzbget.username + ':' + $scope.config.nzbget.password);
        nzbgetService.getServerConfig($scope.config.nzbget.url, basicAuth)
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
