var mainModule = angular.module('mainModule');

mainModule.controller('configCtrl',
  function ($rootScope,
            $scope,
            $controller,
            $ionicPlatform,
            Loki,
            loggerService,
            configService,
            nzbgetService,
            sabnzbdService,
            binnewsService) {
    'use strict';
    $controller('abstractDefaultCtrl', {$scope: $scope});

    $scope.filterCategoryText = 'Filtrer les catégories';
    $scope.filterDefaultPage = 'Page par défaut';
    $scope.categories = [];
    $scope.config = {}

    $scope.pages = [];


    $scope.$on('config:updated', function () {
      $scope.pages = $scope.getPages();
    });

    $ionicPlatform.ready(function () {
      configService.initDB();
      configService.getActualConfig()
        .then(function (actualConfig) {
          $scope.config = actualConfig;
          $scope.categories = $scope.getCategories();
          $scope.pages = $scope.getPages();
        });
    });

    function isInArray(item, array) {
      return (-1 !== array.indexOf(item));
    };

    $scope.getCategories = function () {
      var selectedCategoryIds = [];
      var categories = [];

      if (
        (typeof $scope.config.binnews) != 'undefined' &&
        (typeof $scope.config.binnews.categories) != 'undefined') {
        selectedCategoryIds = $scope.config.binnews.categories.split(';');
      }

      angular.forEach(binnewsService.getCategories(), function (category) {
        var categoryId = category.categoryId.toString();
        var isChecked = isInArray(categoryId, selectedCategoryIds);
        var item = {id: categoryId, text: category.categoryName, checked: isChecked, icon: null};
        categories.push(item);
      });

      return categories;
    };

    $scope.getPages = function () {

      var isApiKeyActivated = false;
      if ((typeof $scope.config.apikey) != 'undefined') {
        isApiKeyActivated = $scope.config.apikey.activated;
      }
      var isBinnewsActivated = false;
      if ((typeof $scope.config.binnews) != 'undefined') {
        isBinnewsActivated = $scope.config.binnews.activated;
      }
      var isNzbClubActivated = false;
      var isFindnzbActivated = false;
      var isBinsearchActivated = false;
      if ((typeof $scope.config.searchengine) != 'undefined') {
        if ((typeof $scope.config.searchengine.nzbclub) != 'undefined') {
          isNzbClubActivated = $scope.config.searchengine.nzbclub.activated;
        }
        if ((typeof $scope.config.searchengine.findnzb) != 'undefined') {
          isFindnzbActivated = $scope.config.searchengine.findnzb.activated;
        }
        if ((typeof $scope.config.searchengine.binsearch) != 'undefined') {
          isBinsearchActivated = $scope.config.searchengine.binsearch.activated;
        }
      }
      var isNzbgetActivated = false;
      if ((typeof $scope.config.nzbget) != 'undefined') {
        isNzbgetActivated = $scope.config.nzbget.activated;
      }
      var isSabnzbdActivated = false;
      if ((typeof $scope.config.sabnzbd) != 'undefined') {
        isSabnzbdActivated = $scope.config.sabnzbd.activated;
      }

      var pages = [
        {id: 'app.config', text: 'Configuration', checked: false, activated: true, icon: null},
        {id: 'app.searchWithNzbsu', text: 'Nzb.su', checked: false, activated: isApiKeyActivated, icon: null},
        {id: 'app.searchWithBinnews', text: 'Binnews', checked: false, activated: isBinnewsActivated, icon: null},
        {id: 'app.searchWithNzbclub', text: 'Nzbclub', checked: false, activated: isNzbClubActivated, icon: null},
        {id: 'app.searchWithFindnzb', text: 'Findnzb', checked: false, activated: isFindnzbActivated, icon: null},
        {id: 'app.searchWithBinsearch', text: 'Binsearch', checked: false, activated: isBinsearchActivated, icon: null},
        {id: 'app.nzbget.queue', text: 'Nzbget', checked: false, activated: isNzbgetActivated, icon: null},
        {id: 'app.sabnzbd.queue', text: 'Sabnzbd', checked: false, activated: isSabnzbdActivated, icon: null},
      ];

      var activatedPages = [];

      var pageAvailable = false;

      angular.forEach(pages, function (page) {
        if ((typeof $scope.config.defaultPageId) != 'undefined' && $scope.config.defaultPageId == page.id) {
          page.checked = true;
          pageAvailable = true;
        }

        if (page.activated) {
          activatedPages.push(page);
        }
      });

      if (!pageAvailable) {
        $scope.config.defaultPageId = 'app.config';
        activatedPages[0].checked = true;
      }

      return activatedPages;
    };

    $scope.submitConfig = function () {
      if ($scope.config.sabnzbd.activated) {
        $scope.config.sabnzbd.checked = false;
        sabnzbdService.getServerVersion($scope.config.sabnzbd)
          .then(function (resp) {
            var version = resp.data.version;
            $scope.config.sabnzbd.version = version;
            $scope.config.sabnzbd.checked = true;
          })
          .catch(function (error) {
            $scope.displayWarningMessage('Attention la configuration car la connexion à Sabnzbd n\'est pas correcte.');
          });
      }

      if ($scope.config.nzbget.activated) {
        $scope.config.nzbget.checked = false;
        nzbgetService.getServerConfig($scope.config.nzbget)
          .then(
          function (resp) {
            var version = extractNzbgetServerVersion(resp.data.result);
            $scope.config.nzbget.version = version;
            $scope.config.nzbget.checked = false;
          })
          .catch(function (error) {
            $scope.displayWarningMessage('Attention la configuration car la connexion à Nzbget n\'est pas correcte.');
          })
      }

      if (typeof $scope.config.$loki != 'undefined') {
        configService.updateConfig($scope.config);
      } else {
        configService.addConfig($scope.config);
      }
      $rootScope.$broadcast('config:updated', $scope.config);
      $scope.displayMessage('La configuration a été correctement sauvegardée.');
    };

    $scope.testNzbgetConfig = function () {
      loggerService.turnOn();
      nzbgetService.getServerConfig($scope.config.nzbget)
        .then(function (resp) {
          var version = extractNzbgetServerVersion(resp.data.result);
          $scope.displayMessage('La connexion à Nzbget ' + version + ' est correctement configuré.');
        })
        .catch(function (error) {
          var errorMessage = (error.data == '') ? error.statusText : error.data;
          $scope.displayErrorMessage('La connexion à Nzbget est incorrectement configuré. Raison (Status ' + error.status + ' : ' + errorMessage + ')');
        })
      ;
    };

    $scope.testSabnzbdConfig = function () {
      loggerService.turnOn();
      sabnzbdService.getServerVersion($scope.config.sabnzbd)
        .then(function (resp) {
          var version = resp.data.version;
          $scope.displayMessage('La connexion à Sabnzbd ' + version + ' est correctement configuré.');
        })
        .catch(function (error) {
          var errorMessage = (error.data == '') ? error.statusText : error.data;
          $scope.displayErrorMessage('La connexion à Sabnzbd est incorrectement configuré. Raison (Status ' + error.status + ' : ' + errorMessage + ')');
        })
      ;
    };

    function extractNzbgetServerVersion(datas) {
      var version = null;
      angular.forEach(datas, function (data) {
        if (data.Name == 'Version') {
          version = data.Value;
        }
      });
      return version;
    }
  }
)
;
