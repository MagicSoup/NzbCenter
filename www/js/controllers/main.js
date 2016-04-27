var mainModule = angular.module('mainModule', ['ngCordova', 'ab-base64', 'services']);

mainModule.controller('mainCtrl', [
    '$scope',
    '$timeout',
    'configService',
    function ($scope, $timeout, configService) {

      $scope.config = {};
      $scope.hasMessageToDisplay = false;
      $scope.isErrorMessage = false;
      var hideMessageFunction;

      configService.initDB();
      configService.getActualConfig().then(function (config) {
        $scope.config = config;
      });

      $scope.$on('config:updated', function (event, data) {
        $scope.config = data;
      });

      $scope.$on('message:display', function (event, isError, data) {
        $scope.isErrorMessage = isError;
        $scope.hasMessageToDisplay = true;
        $scope.messageToDisplay = data;
        $timeout.cancel(hideMessageFunction);
        hideMessageFunction = $timeout(function () {
          $scope.hasMessageToDisplay = false;
        }, 5000);

      });

    }]
);
