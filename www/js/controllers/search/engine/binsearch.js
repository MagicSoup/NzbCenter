var mainModule = angular.module('mainModule');

mainModule.controller('searchWithBinsearchCtrl',
  function ($rootScope,
            $scope,
            $controller,
            $stateParams,
            $http,
            $q,
            loggerService,
            searchEngineService,
            nzbgetService,
            sabnzbdService,
            binsearchSearchEndpoint) {
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
      var searchUrl = endpoint.url + '?q=' + filter + '&m=&max=250&adv_g=&adv_age=999&adv_sort=date&adv_col=on&xminsize=&xmaxsize=&font=small&postdate=&hideposter=on&hidegroup=on';
      return searchUrl;
    };

    $scope.submitSearch = function (query) {
      if (!query) {
        $scope.displayWarningMessage('Veuillez spécifier un critère de recherche');
        return;
      }

      $scope.splashScreenShow();
      $scope.datas = [];
      $scope.isFullyLoaded = false;
      var searchUrl = buildSearchUrl(binsearchSearchEndpoint, query);
      searchEngineService.searchWithBinsearch(searchUrl)
        .then(
        function (datas) {
          $scope.datas = datas;
          $scope.isFullyLoaded = true;
          $scope.splashScreenHide();
        },
        function (errors) {
          $scope.splashScreenHide();
          $scope.displayErrorMessage('Une erreur est survenue lors de la recherche avec Binsearch. Vérifiez que le service est toujours disponible.');
        }
      );
    };

    $scope.downloadUrlWithSabnzbd = function (url) {
      $scope.downloadPopover.hide();
      loggerService.log('downloadUrlWithSabnzbd => ' + url);
      sabnzbdService.sendNzbFile($scope.config.sabnzbd, $scope.filters.query, url)
        .then(function (resp) {
          if (resp.data.startsWith('ok')) {
            loggerService.log('The nzb file was successfuly uploaded to Sabnzbd');
            $scope.displayMessage('Le fichier NZB a été correctement envoyé à Sabnzbd');
          } else {
            loggerService.log('Error while trying to upload the nzb to Sabnzbd  : ' + resp.data, 'e');
            $scope.displayErrorMessage('Une erreur est survenue lors de la tentative d\'envoi du fichier NZB à Sabnzb : ' + resp.data);
          }
        })
        .catch(function (error) {
          var errorMessage = (error.data == '') ? error.statusText : error.data;
          $scope.displayErrorMessage('Une erreur est survenue lors de l\'envoi du fichier à Sabnzbd. Raison (Status ' + error.status + ' : ' + errorMessage + ')');
        })
      ;
    };

    $scope.downloadUrlWithNzbget = function (url) {
      $scope.downloadPopover.hide();
      loggerService.log('encodeURI downloadUrlWithNzbget => ' + encodeURI(url));
      nzbgetService.sendNzbFile($scope.config.nzbget, $scope.filters.query, url)
        .then(function (resp) {
          var result = resp.data.result;
          if (result <= 0) {
            loggerService.log('Error while trying to upload the nzb to Nzbget  : ' + resp.data, 'e');
            $scope.displayErrorMessage('Une erreur est survenue lors de la tentative d\'envoi du fichier NZB à Nzbget : ' + resp.data);
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
    };
  }
);
