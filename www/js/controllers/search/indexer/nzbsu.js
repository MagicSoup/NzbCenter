var mainModule = angular.module('mainModule');

mainModule.controller('searchWithNzbsuCtrl', [
    '$rootScope',
    '$scope',
    '$controller',
    '$http',
    '$q',
    'base64',
    'loggerService',
    'searchIndexerService',
    'nzbgetService',
    'sabnzbdService',
    'nzbsuApiEndpoint',
    'nzbsuDownloadEndpoint',
    function ($rootScope,
              $scope,
              $controller,
              $http,
              $q,
              base64,
              loggerService,
              searchIndexerService,
              nzbgetService,
              sabnzbdService,
              nzbsuApiEndpoint,
              nzbsuDownloadEndpoint) {
      'use strict';
      $controller('abstractSearchCtrl', {$scope: $scope});

      loggerService.turnOn();

      $scope.submitSearch = function () {
        $scope.splashScreenShow();
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        searchIndexerService.search(nzbsuApiEndpoint.url, $scope.config.apikey.nzbsu, $scope.filters.query)
          .then(function (datas) {
            $scope.datas = datas;
            $scope.isFullyLoaded = true;
            $scope.splashScreenHide();
          });
      };

      $scope.downloadUrlWithSabnzbd = function (url) {
        $scope.downloadPopover.hide();
        loggerService.log('downloadUrlWithSabnzbd => ' + url);
        var basicAuth = base64.encode($scope.config.sabnzbd.username + ':' + $scope.config.sabnzbd.password);
        sabnzbdService.sendNzbFile($scope.config.sabnzbd.url, basicAuth, $scope.config.sabnzbd.apikey, $scope.filters.query, $scope.config.sabnzbd.category, url).then(function (resp) {
          if (resp.startsWith('ok')) {
            loggerService.log('The nzb file was successfuly uploaded to Sabnzbd');
            $scope.displayMessage('Le fichier NZB a été correctement envoyé à Sabnzbd');
          } else {
            loggerService.log('Error while trying to upload the nzb to Sabnzbd  : ' + resp, 'e');
            $scope.displayErrorMessage('Une erreur est survenue lors de la tentative d\'envoi du fichier NZB à Sabnzb');
          }
        });
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
                $scope.displayErrorMessage('Une erreur est survenue lors de la tentative d\'envoi du fichier NZB à Nzbget');
              } else {
                loggerService.log('The nzb file was successfuly uploaded to Nzbget');
                $scope.displayMessage('Le fichier NZB a été correctement envoyé à Nzbget');
              }
            });
          })
          .error(function (err) {
            loggerService.log(err, 'e');
            $scope.displayErrorMessage('Une erreur est survenue lors de la tentative d\'envoi du fichier NZB à Nzbget');
          });

      };
    }]
);
