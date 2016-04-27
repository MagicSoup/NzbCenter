var mainModule = angular.module('mainModule');

mainModule.controller('searchWithFindnzbCtrl', [
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
    'findnzbSearchEndpoint',
    'findnzbGetEndpoint',
    'findnzbDownloadEndpoint',
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
              findnzbSearchEndpoint,
              findnzbGetEndpoint,
              findnzbDownloadEndpoint) {

      $scope.config = {};
      $scope.filters = {
        query: ''
      };
      $scope.datas = [];
      $scope.isFullyLoaded = false;
      $scope.link = null;

      loggerService.turnOn();

      function buildSearchUrl(endpoint, filter) {
        var searchUrl = endpoint.url + '?q=' + filter;
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
        $scope.downloadPopover.hide();
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
              if (((typeof href != 'undefined') && href.match('save')) &&
                (typeof saveHref == 'undefined')) {
                saveHref = href;
                loggerService.log('extracted url => ' + saveHref);
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

      $scope.downloadUrlOnDisk = function (url) {
        downloadUrl(url)
          .then(function (resp) {
            loggerService.log('downloadUrlOnDisk => ' + resp);
          });
      };

      $scope.downloadUrlWithSabnzbd = function (url) {
        $scope.downloadPopover.hide();
        downloadUrl(url)
          .then(function (respUrl) {
            var basicAuth = base64.encode($scope.config.sabnzbd.username + ':' + $scope.config.sabnzbd.password);
            sabnzbdService.sendNzbFile($scope.config.sabnzbd.url, basicAuth, $scope.config.sabnzbd.apikey, $scope.filters.query, $scope.config.sabnzbd.category, respUrl).then(function (resp) {
              if (resp.startsWith('ok')) {
                loggerService.log('The nzb file was successfuly uploaded to Sabnzbd');
              } else {
                loggerService.log('Error while trying to upload the nzb to Sabnzbd  : ' + resp, 'e');
              }
            });

          });
      };

      $scope.downloadUrlWithNzbget = function (url) {
        $scope.downloadPopover.hide();
        downloadUrl(url)
          .then(function (resp) {
            loggerService.log('downloadUrlWithNzbget => ' + resp);
            var proxyfiedUrl = resp.replace(/http:\/\/findnzb.net\/get/g, findnzbDownloadEndpoint.url);
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
