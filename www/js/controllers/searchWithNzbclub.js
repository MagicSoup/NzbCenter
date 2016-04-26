var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('searchWithNzbclubCtrl', [
    '$scope',
    '$http',
    '$q',
    '$ionicLoading',
    '$ionicPopover',
    'loggerService',
    'searchEngineService',
    'nzbclubSearchEndpoint',
    function ($scope,
              $http,
              $q,
              $ionicLoading,
              $ionicPopover,
              loggerService,
              searchEngineService,
              nzbclubSearchEndpoint) {

      $scope.filters = {
        query: 'johnossi'
      };

      $scope.datas = [];
      $scope.isFullyLoaded = false;

      loggerService.turnOn();

      $scope.submitSearch = function () {
        splashScreenShow();
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        var searchUrl = buildSearchUrl(nzbclubSearchEndpoint, $scope.filters.query);
        searchEngineService.search(searchUrl)
          .then(function (datas) {
            $scope.datas = datas;
            $scope.isFullyLoaded = true;
            splashScreenHide();
          });
      };

      $scope.downloadUrl = function (url) {
        loggerService.log('Nzbclub url : ' + url);
      };

      function buildSearchUrl(endpoint, filter) {
        var searchUrl = endpoint.url + '?q=' + filter + '&de=27&st=1&ns=0';
        return searchUrl;
      };

      function splashScreenHide(){
        $ionicLoading.hide();
      };

      function splashScreenShow(){
        $ionicLoading.show();
      };
    }]
);
