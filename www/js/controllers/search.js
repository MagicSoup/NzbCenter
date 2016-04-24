var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('searchCtrl', [
    '$scope',
    'loggerService',
    'binsearchService',
    'nzbindexService',
    function ($scope, loggerService, binsearchService, nzbindexService) {

      $scope.filters = {
        binsearch: '',
        nzbindex: ''
      };

      $scope.datas = [];
      $scope.isFullyLoaded = false;

      loggerService.turnOn();

      $scope.submitNzbindex = function () {
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        nzbindexService.search($scope.filters.nzbindex).then(function (datas) {
          $scope.datas = datas;
          $scope.isFullyLoaded = true;
        })
      };
      $scope.submitBinsearch = function () {
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        binsearchService.search($scope.filters.binsearch).then(function (datas) {

          //TODO

          $scope.isFullyLoaded = false;
        })
      };
    }]
);
