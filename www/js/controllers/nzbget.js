var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('nzbgetCtrl', [
    '$scope',
    'loggerService',
    'nzbgetService',
    function ($scope, loggerService, nzbgetService) {

      $scope.datas = [];
      $scope.isFullyLoaded = false;

      $scope.testLogger = function () {
        loggerService.turnOn();
        loggerService.log('LOGGING nzbget nzbget...');
      };

      $scope.getServerConfig = function () {
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        nzbgetService.getServerConfig().then(function (configJson) {

          loggerService.turnOn();

          $scope.datas = configJson.data.result;
          angular.forEach($scope.datas, function (data) {
            loggerService.log(data.Name + ' => ' + data.Value);
          });

          $scope.isFullyLoaded = true;
        });

      };

    }]
);
