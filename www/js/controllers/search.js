var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('searchCtrl', [
    '$scope',
    '$http',
    '$q',
    '$ionicLoading',
    'loggerService',
    'searchEngineService',
    'nzbclubSearchEndpoint',
    'findnzbSearchEndpoint',
    'findnzbGetEndpoint',
    function ($scope,
              $http,
              $q,
              $ionicLoading,
              loggerService,
              searchEngineService,
              nzbclubSearchEndpoint,
              findnzbSearchEndpoint,
              findnzbGetEndpoint) {

      $scope.filters = {
        findnzb: 'johnossi',
        nzbclub: 'johnossi'
      };

      $scope.datas = [];
      $scope.isFullyLoadedNzbclub = false;
      $scope.isFullyLoadedFindNzb = false;

      loggerService.turnOn();

      $scope.submitNzbclub = function () {
        splashScreenShow();
        $scope.datas = [];
        $scope.isFullyLoadedNzbclub = false;
        var searchUrl = buildNzbClubUrl(nzbclubSearchEndpoint, $scope.filters.nzbclub);
        searchEngineService.search(searchUrl)
          .then(function (datas) {
            $scope.datas = datas;
            $scope.isFullyLoadedNzbclub = true;
            splashScreenHide();
          });
      };

      $scope.submitFindnzb = function () {
        splashScreenShow();
        $scope.datas = [];
        $scope.isFullyLoadedFindNzb = false;
        var searchUrl = buildFindNzbUrl(findnzbSearchEndpoint, $scope.filters.findnzb);
        searchEngineService.search(searchUrl)
          .then(function (datas) {
            $scope.datas = datas;
            $scope.isFullyLoadedFindNzb = true;
            splashScreenHide();
          });
      };

      $scope.downloadUrlForNzbclub = function (url) {
        loggerService.log('Nzbclub url : ' + url);
      };

      $scope.downloadUrlForFindNzb = function (url) {
        var deferred = $q.defer();
        loggerService.log('FindNzb real url : ' + url);
        var proxyfiedUrl = url.replace(/http:\/\/findnzb.net\/nzb\//g, findnzbGetEndpoint.url);
        loggerService.log('Proxyfied url : ' + proxyfiedUrl);
        $http({
          method: 'GET',
          url: proxyfiedUrl
        })
          .success(function (resp) {
            var parser = new DOMParser();
            var doc = parser.parseFromString(resp, 'text/html');
            var links = doc.firstChild.parentNode.links;
            var saveHref;
            angular.forEach(links, function (link) {
              var href = link.href;
              if(((typeof href != 'undefined') && href.match('save')) &&
                  (typeof saveHref == 'undefined')) {
                loggerService.log('link => ' + href);
                saveHref = href;
              }
            });
            deferred.resolve(saveHref);
          })
          .error(function (err) {
            loggerService.log(err, 'e');
            deferred.reject(err);
          });

        return deferred.promise;
      };

      function buildNzbClubUrl(endpoint, filter) {
        var searchUrl = endpoint.url + '?q=' + filter + '&de=27&st=1&ns=0';
        return searchUrl;
      };

      function buildFindNzbUrl(endpoint, filter) {
        var searchUrl = endpoint.url + '?q=' + filter;
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
