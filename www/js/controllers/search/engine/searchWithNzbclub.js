var mainModule = angular.module('mainModule');

mainModule.controller('searchWithNzbclubCtrl', [
    '$scope',
    '$http',
    '$q',
    'base64',
    '$ionicLoading',
    '$ionicPopover',
    'configService',
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
              configService,
              loggerService,
              searchEngineService,
              nzbgetService,
              sabnzbdService,
              nzbclubSearchEndpoint,
              nzbclubDownloadEndpoint) {

      $scope.config = {};
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

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.filters.query = '';
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        configService.getActualConfig().then(function (actualConfig) {
          $scope.config = actualConfig;
        });
      });

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
        $scope.downloadPopover.hide();
        loggerService.log('downloadUrlWithSabnzbd => ' + url);
        var basicAuth = base64.encode($scope.config.sabnzbd.username + ':' + $scope.config.sabnzbd.password);
        sabnzbdService.sendNzbFile($scope.config.sabnzbd.url, basicAuth, $scope.config.sabnzbd.apikey, $scope.filters.query, $scope.config.sabnzbd.category, url).then(function (resp) {
          if (resp.startsWith('ok')) {
            loggerService.log('The nzb file was successfuly uploaded to Sabnzbd');
          } else {
            loggerService.log('Error while trying to upload the nzb to Sabnzbd  : ' + resp, 'e');
          }
        });
      };

      $scope.downloadUrlWithNzbget = function (url) {
        $scope.downloadPopover.hide();
        loggerService.log('downloadUrlWithNzbget => ' + url);
        var proxyfiedUrl = url.replace(/http:\/\/www.nzbclub.com\/nzb_get/g, nzbclubDownloadEndpoint.url);
        loggerService.log('downloadUrlWithNzbget proxyfiedUrl => ' + proxyfiedUrl);
        $http.get(proxyfiedUrl)
          .success(function (resp) {
            var urlContentAsBase64 = base64.encode(resp);
            var basicAuth = base64.encode($scope.config.nzbget.username + ':' + $scope.config.nzbget.password);
            nzbgetService.sendNzbFile($scope.config.nzbget.url, basicAuth, $scope.filters.query, $scope.config.nzbget.category, urlContentAsBase64).then(function (resp) {
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
        //$ionicLoading.hide();
      };

      function splashScreenShow() {
        //$ionicLoading.show();
      };

      $ionicPopover.fromTemplateUrl('download-popover.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.downloadPopover = popover;
      });

      $scope.openDownloadPopover = function ($event, link) {
        $scope.downloadPopover.show($event);
        $scope.link = link;
      };

      $scope.closeDownloadPopover = function () {
        $scope.downloadPopover.hide();
      };

      $scope.$on('$destroy', function () {
        $scope.downloadPopover.remove();
      });
    }]
);
