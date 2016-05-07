var mainModule = angular.module('mainModule', ['ionic-modal-select', 'ngCordova', 'ab-base64', 'services']);

mainModule.controller('mainCtrl',
  function ($rootScope, $scope, $timeout, configService) {
    //load config in root scope
    $scope.config = {};
    $scope.hasMessageToDisplay = false;
    $scope.type = "balanced";
    var hideMessageFunction;

    configService.initDB();
    configService.getActualConfig().then(function (config) {
      $scope.config = config;
    });

    $scope.$on('config:updated', function (event, data) {
      $scope.config = data;
    });

    $scope.$on('message:display', function (event, type, message) {
      $scope.type = type;
      $scope.hasMessageToDisplay = true;
      $scope.messageToDisplay = message;
      $timeout.cancel(hideMessageFunction);
      hideMessageFunction = $timeout(function () {
        $scope.hasMessageToDisplay = false;
      }, 5000);
    });
  }
);
