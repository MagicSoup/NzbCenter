var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('searchCtrl', [
    '$scope',
    'loggerService',
    'binsearchService',
    'nzbindexService',
    function ($scope, loggerService, binsearchService, nzbindexService) {

      $scope.datas = [];
      $scope.isFullyLoaded = false;

      $scope.useNzbindex = function () {
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        nzbindexService.search().then(function (result) {

          loggerService.turnOn();

          //TODO

          $scope.isFullyLoaded = false;
        })
      };
      $scope.useBinsearch = function () {
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        binsearchService.search().then(function (result) {

          loggerService.turnOn();

          //TODO

          $scope.isFullyLoaded = false;
        })
      };
    }]
);
