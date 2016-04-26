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

          $scope.datas = config.result;
          angular.forEach($scope.datas, function (data) {
            loggerService.log(data.Name + ' => ' + data.Value);
          });

          $scope.isFullyLoaded = true;
        });
      };

      $scope.sendNzbFile = function () {
        $scope.isFullyLoaded = false;
        nzbgetService.sendNzbFile().then(function (resp) {

          loggerService.turnOn();
          //todo manager the resp.result error cases <= 0
          loggerService.log('Nzbget controler id : ' + resp.id);
          loggerService.log('Nzbget controler result : ' + resp.result);
          loggerService.log('Nzbget controler version : ' + resp.version);
        });
      };

    }]
);
