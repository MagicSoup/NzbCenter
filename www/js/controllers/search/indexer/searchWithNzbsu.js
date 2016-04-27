var mainModule = angular.module('mainModule');

mainModule.controller('searchWithNzbsuCtrl', [
    '$scope',
    '$http',
    '$q',
    'base64',
    '$ionicLoading',
    '$ionicPopover',
    'configService',
    'loggerService',
    'searchIndexerService',
    'nzbgetService',
    'sabnzbdService',
    'nzbsuApiEndpoint',
    'nzbsuDownloadEndpoint',
    function ($scope,
              $http,
              $q,
              base64,
              $ionicLoading,
              $ionicPopover,
              configService,
              loggerService,
              searchIndexerService,
              nzbgetService,
              sabnzbdService,
              nzbsuApiEndpoint,
              nzbsuDownloadEndpoint) {

      $scope.config = {};
      $scope.filters = {
        query: ''
      };
      $scope.datas = [];
      $scope.isFullyLoaded = false;

      loggerService.turnOn();

      $scope.$on('$ionicView.beforeEnter', function () {
        configService.getActualConfig().then(function (actualConfig) {
          $scope.config = actualConfig;
        });
      });

      $scope.submitSearch = function () {
        splashScreenShow();
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        searchIndexerService.search(nzbsuApiEndpoint.url, $scope.config.apikey.nzbsu, $scope.filters.query)
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
        var proxyfiedUrl = url.replace(/https:\/\/api.nzb.su\/getnzb/g, nzbsuDownloadEndpoint.url);
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
        $ionicLoading.hide();
      };

      function splashScreenShow() {
        $ionicLoading.show();
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
