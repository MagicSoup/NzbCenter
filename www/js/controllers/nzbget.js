var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('nzbgetCtrl', [
    '$scope',
    'loggerService',
    'nzbgetService',
    function ($scope, loggerService, nzbgetService) {

      $scope.datas = [];
      $scope.isFullyLoaded = false;

      $scope.getServerConfig = function () {
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        nzbgetService.getServerConfig().then(function (config) {

          loggerService.turnOn();

          $scope.datas = config.data.result;
          angular.forEach($scope.datas, function (data) {
            loggerService.log(data.Name + ' => ' + data.Value);
          });

          $scope.isFullyLoaded = true;
        });
      };

    }]
);
