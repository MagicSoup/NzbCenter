var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('searchWithFindnzbCtrl', [
    '$scope',
    '$http',
    '$q',
    '$ionicLoading',
    '$ionicPopover',
    'loggerService',
    'searchEngineService',
    'nzbgetService',
    'sabnzbdService',
    'findnzbSearchEndpoint',
    'findnzbGetEndpoint',
    function ($scope,
              $http,
              $q,
              $ionicLoading,
              $ionicPopover,
              loggerService,
              searchEngineService,
              nzbgetService,
              sabnzbdService,
              findnzbSearchEndpoint,
              findnzbGetEndpoint) {

      $scope.filters = {
        query: 'johnossi'
      };
      $scope.datas = [];
      $scope.isFullyLoaded = false;
      $scope.link = null;

      loggerService.turnOn();

      $scope.submitSearch = function () {
        $scope.link = null;
        splashScreenShow();
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        var searchUrl = buildSearchUrl(findnzbSearchEndpoint, $scope.filters.query);
        searchEngineService.search(searchUrl)
          .then(function (datas) {
            $scope.datas = datas;
            $scope.isFullyLoaded = true;
            splashScreenHide();
          });
      };

      function downloadUrl(url) {
        var deferred = $q.defer();
        var proxyfiedUrl = url.replace(/http:\/\/findnzb.net\/nzb/g, findnzbGetEndpoint.url);
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
                saveHref = href;
              }
            });
            $scope.downloadPopover.hide();
            deferred.resolve(saveHref);
          })
          .error(function (err) {
            loggerService.log(err, 'e');
            deferred.reject(err);
          });

        return deferred.promise;
      };

      $scope.downloadUrlOnDisk = function (url){
        downloadUrl(url)
          .then(function(resp){
            loggerService.log('downloadUrlOnDisk => ' + resp);
          });
      };

      $scope.downloadUrlWithSabnzbd = function (url){
        downloadUrl(url)
          .then(function(resp){
            loggerService.log('downloadUrlWithSabnzbd => ' + resp);
          });
      };

      $scope.downloadUrlWithNzbget = function (url){
        downloadUrl(url)
          .then(function(resp){
            loggerService.log('downloadUrlWithNzbget => ' + resp);
          });
      };

      function buildSearchUrl(endpoint, filter) {
        var searchUrl = endpoint.url + '?q=' + filter;
        return searchUrl;
      };

      function splashScreenHide(){
        $ionicLoading.hide();
      };

      function splashScreenShow(){
        $ionicLoading.show();
      };

      // init popover
      $ionicPopover.fromTemplateUrl('download-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.downloadPopover = popover;
        loggerService.log('init downloadPopover called');
      });


      $scope.openDownloadPopover = function($event, link) {
        $scope.downloadPopover.show($event);
        $scope.link = link;
        loggerService.log('link : ' + link);
        loggerService.log('openDownloadPopover called');
      };
      $scope.closeDownloadPopover = function() {
        $scope.downloadPopover.hide();
        loggerService.log('closeDownloadPopover called');
      };

      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.downloadPopover.remove();
        loggerService.log('$scope.$on => $destroy called');
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function() {
        loggerService.log('$scope.$on => popover.hidden called');
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function() {
        loggerService.log('$scope.$on => popover.removed called');
      });
    }]
);
