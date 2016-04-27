var mainModule = angular.module('mainModule');

mainModule.controller('configCtrl', [
    '$rootScope',
    '$scope',
    '$ionicPlatform',
    '$ionicLoading',
    'Loki',
    'loggerService',
    'configService',
    function ($rootScope, $scope, $ionicPlatform, $ionicLoading, Loki, loggerService, configService) {

      $scope.config = {};

      $ionicPlatform.ready(function () {
        //$ionicLoading.show();
        configService.initDB();
        configService.getActualConfig().then(function (actualConfig) {
          $scope.config = actualConfig;
          //$ionicLoading.hide();
        });
      });

      $scope.submitConfig = function () {
        if (typeof $scope.config.$loki != 'undefined') {
          configService.updateConfig($scope.config);
        } else {
          configService.addConfig($scope.config);
        }
        $rootScope.$broadcast('config:updated', $scope.config);
        displayMessage('La configuration a été correctement sauvegardée.', false);
      };

      function displayMessage(message,isError){
        $rootScope.$broadcast('message:display', false, message);
      }
      //TODO add some function used to test the connection to the service

    }
  ]
);
