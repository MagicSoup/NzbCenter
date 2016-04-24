var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('searchCtrl', [
    '$scope',
    'loggerService',
    'binsearchService',
    'nzbindexService',
    'nzbclubService',
    function ($scope,
              loggerService,
              binsearchService,
              nzbindexService,
              nzbclubService) {

      $scope.filters = {
        binsearch: 'johnossi',
        nzbindex: 'johnossi',
        nzbclub: 'johnossi'
      };

      $scope.datas = [];
      $scope.isFullyLoaded = false;

      loggerService.turnOn();

      $scope.submitNzbclub = function () {
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        nzbclubService.search($scope.filters.nzbclub).then(function (datas) {
          $scope.datas = datas;
          $scope.isFullyLoaded = true;
        })
      };

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
          $scope.datas = datas;
          $scope.isFullyLoaded = true;
        })
      };

    }]
);
