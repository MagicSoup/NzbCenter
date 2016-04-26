var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('searchWithNzbclubCtrl', [
    '$scope',
    '$http',
    '$q',
    'base64',
    '$ionicLoading',
    '$ionicPopover',
    'loggerService',
    'searchEngineService',
    'nzbgetService',
    'sabnzbdService',
    'nzbclubSearchEndpoint',
    'nzbclubDownloadEndpoint',
    function ($scope,
              $http,
              $q,
              base64,
              $ionicLoading,
              $ionicPopover,
              loggerService,
              searchEngineService,
              nzbgetService,
              sabnzbdService,
              nzbclubSearchEndpoint,
              nzbclubDownloadEndpoint) {

      $scope.filters = {
        query: ''
      };

      $scope.datas = [];
      $scope.isFullyLoaded = false;

      loggerService.turnOn();

      function buildSearchUrl(endpoint, filter) {
        var searchUrl = endpoint.url + '?q=' + filter + '&de=27&st=1&ns=0';
        return searchUrl;
      };

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

      $scope.downloadUrlOnDisk = function (url) {
        loggerService.log('downloadUrlOnDisk => ' + url);
      };

      $scope.downloadUrlWithSabnzbd = function (url) {
        loggerService.log('downloadUrlWithSabnzbd => ' + url);
      };

      $scope.downloadUrlWithNzbget = function (url) {
        $scope.downloadPopover.hide();
        loggerService.log('downloadUrlWithNzbget => ' + url);
        var proxyfiedUrl = url.replace(/http:\/\/www.nzbclub.com\/nzb_get/g, nzbclubDownloadEndpoint.url);
        loggerService.log('downloadUrlWithNzbget proxyfiedUrl => ' + proxyfiedUrl);
        $http.get(proxyfiedUrl)
          .success(function (resp) {
            var urlContentAsBase64 = base64.encode(resp);
            var basicAuth = base64.encode('admin:R6?nUi9n');
            nzbgetService.sendNzbFile(basicAuth, $scope.filters.query, 'nzbget', urlContentAsBase64).then(function (resp) {
              var result = resp.result;
              if (result <= 0) {
                loggerService.log('Error while trying to upload the nzb to Nzbget  : ' + result, 'e');
              } else {
                loggerService.log('The nzb file was successfuly uploaded to Nzbget');
              }
            });
          })
          .error(function (err) {
            loggerService.log(err, 'e');
            deferred.reject(err);
          });

      };

      function splashScreenHide() {
        $ionicLoading.hide();
      };

      function splashScreenShow() {
        $ionicLoading.show();
      };

      // init popover
      $ionicPopover.fromTemplateUrl('download-popover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.downloadPopover = popover;
        loggerService.log('init downloadPopover called');
      });

      $scope.openDownloadPopover = function ($event, link) {
        $scope.downloadPopover.show($event);
        $scope.link = link;
        loggerService.log('link : ' + link);
        loggerService.log('openDownloadPopover called');
      };
      $scope.closeDownloadPopover = function () {
        $scope.downloadPopover.hide();
        loggerService.log('closeDownloadPopover called');
      };

      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function () {
        $scope.downloadPopover.remove();
        loggerService.log('$scope.$on => $destroy called');
      });
      // Execute action on hide popover
      $scope.$on('popover.hidden', function () {
        loggerService.log('$scope.$on => popover.hidden called');
      });
      // Execute action on remove popover
      $scope.$on('popover.removed', function () {
        loggerService.log('$scope.$on => popover.removed called');
      });
    }]
);
