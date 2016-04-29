var mainModule = angular.module('mainModule');

mainModule.controller('configCtrl', [
    '$rootScope',
    '$scope',
    '$controller',
    '$ionicPlatform',
    'Loki',
    'loggerService',
    'configService',
    function ($rootScope,
              $scope,
              $controller,
              $ionicPlatform,
              Loki,
              loggerService,
              configService) {
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

      //TODO add some function used to test the connection to the service

    }
  ]
);
