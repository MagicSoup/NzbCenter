var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('nzbgetCtrl', [
    '$scope',
    'loggerService',
    'nzbgetService',
    function ($scope, loggerService, nzbgetService) {

      $scope.testLogger = function() {
        loggerService.turnOn();
        loggerService.log('TEST Injection Service');
      };
    }]
);
