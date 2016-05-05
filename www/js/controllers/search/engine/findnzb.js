var mainModule = angular.module('mainModule');

mainModule.controller('searchWithFindnzbCtrl', [
    '$rootScope',
    '$scope',
    '$controller',
    '$stateParams',
    '$http',
    '$q',
    'base64',
    'loggerService',
    'searchEngineService',
    'nzbgetService',
    'sabnzbdService',
    'findnzbSearchEndpoint',
    'findnzbGetEndpoint',
    function ($rootScope,
              $scope,
              $controller,
              $stateParams,
              $http,
              $q,
              base64,
              loggerService,
              searchEngineService,
              nzbgetService,
              sabnzbdService,
              findnzbSearchEndpoint,
              findnzbGetEndpoint) {
      'use strict';
      $controller('abstractSearchCtrl', {$scope: $scope});

      loggerService.turnOn();

      $scope.init = function () {
        if (!$stateParams.query.startsWith('empty')) {
          $scope.$watch($scope.config, function () {
            $scope.filters.query = $stateParams.query;
            $scope.submitSearch($stateParams.query);
          });
        }
      };

      function buildSearchUrl(endpoint, filter) {
        var searchUrl = endpoint.url + '?q=' + filter;
        return searchUrl;
      };

      $scope.submitSearch = function (query) {
        if (!query) {
          $scope.displayWarningMessage('Veuillez spécifier un critère de recherche');
          return;
        }

        $scope.link = null;
        $scope.splashScreenShow();
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        var searchUrl = buildSearchUrl(findnzbSearchEndpoint, query);
        searchEngineService.search(searchUrl)
          .then(function (datas) {
            $scope.datas = datas;
            $scope.isFullyLoaded = true;
            $scope.splashScreenHide();
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

      $scope.downloadUrlWithSabnzbd = function (url) {
        $scope.downloadPopover.hide();
        downloadUrl(url)
          .then(function (respUrl) {
            var basicAuth = base64.encode($scope.config.sabnzbd.username + ':' + $scope.config.sabnzbd.password);
            sabnzbdService.sendNzbFile($scope.config.sabnzbd.url, basicAuth, $scope.config.sabnzbd.apikey, $scope.filters.query, $scope.config.sabnzbd.category, respUrl)
              .then(function (resp) {
                if (resp.data.startsWith('ok')) {
                  loggerService.log('The nzb file was successfuly uploaded to Sabnzbd');
                  $scope.displayMessage('Le fichier NZB a été correctement envoyé à Sabnzbd');
                } else {
                  loggerService.log('Error while trying to upload the nzb to Sabnzbd  : ' + resp, 'e');
                  $scope.displayErrorMessage('Une erreur est survenue lors de la tentative d\'envoi du fichier NZB à Sabnzb');
                }
              })
              .catch(function (error) {
                var errorMessage = (error.data == '') ? error.statusText : error.data;
                $scope.displayErrorMessage('Une erreur est survenue lors de l\'envoi du fichier à Sabnzbd. Raison (Status ' + error.status + ' : ' + errorMessage + ')');
              })
            ;

          });
      };

      $scope.downloadUrlWithNzbget = function (url) {
        $scope.downloadPopover.hide();
        downloadUrl(url)
          .then(function (resp) {
            loggerService.log('encodeURI downloadUrlWithNzbget => ' + encodeURI(resp));
            var basicAuth = base64.encode($scope.config.nzbget.username + ':' + $scope.config.nzbget.password);
            nzbgetService.sendNzbFile($scope.config.nzbget.url, basicAuth, $scope.filters.query, $scope.config.nzbget.category, resp)
              .then(function (resp) {
                var result = resp.data.result;
                if (result <= 0) {
                  loggerService.log('Error while trying to upload the nzb to Nzbget  : ' + result, 'e');
                  $scope.displayErrorMessage('Une erreur est survenue lors de la tentative d\'envoi du fichier NZB à Nzbget');
                } else {
                  loggerService.log('The nzb file was successfuly uploaded to Nzbget');
                  $scope.displayMessage('Le fichier NZB a été correctement envoyé à Nzbget');
                }
              })
              .catch(function (error) {
                var errorMessage = (error.data == '') ? error.statusText : error.data;
                $scope.displayErrorMessage('Une erreur est survenue lors de l\'envoi du fichier à Nzbget. Raison (Status ' + error.status + ' : ' + errorMessage + ')');
              })
            ;
          });
      };
    }]
);
