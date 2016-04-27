var mainModule = angular.module('mainModule', ['ngCordova', 'ab-base64', 'services']);

mainModule.controller('mainCtrl', [
    '$scope',
    'configService',
    function ($scope, configService) {

      $scope.config = {};

      configService.initDB();
      configService.getActualConfig().then(function (config) {
        $scope.config = config;
      });

      $scope.$on('config:updated', function (event, data) {
        $scope.config = data;
      });

    }]
);
