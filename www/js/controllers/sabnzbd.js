var mainModule = angular.module('mainModule');

mainModule.controller('sabnzbdCtrl', [
    '$scope',
    'loggerService',
    'sabnzbdService',
    function ($scope, loggerService, sabnzbdService) {

      $scope.testLogger = function() {
        loggerService.turnOn();
        loggerService.log('LOGGING sabnzbd sabnzbd...');
      };
    }]
);
