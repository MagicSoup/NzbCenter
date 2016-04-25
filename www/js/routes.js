angular.module('nzb-manager')
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('app', {
        url: '/nzb-manager',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'configCtrl'
      })

      .state('app.config', {
        url: '/config',
        views: {
          'menuContent': {
            templateUrl: 'templates/config.html',
            controller: 'configCtrl'
          }
        }
      })

      .state('app.searchWithNzbclub', {
        url: '/searchWithNzbclub',
        views: {
          'menuContent': {
            templateUrl: 'templates/search-with-nzbclub.html',
            controller: 'searchCtrl'
          }
        }
      })

      .state('app.searchWithFindnzb', {
        url: '/searchWithFindnzb',
        views: {
          'menuContent': {
            templateUrl: 'templates/search-with-findnzb.html',
            controller: 'searchCtrl'
          }
        }
      })

      .state('app.nzbget', {
        url: '/nzbget',
        views: {
          'menuContent': {
            templateUrl: 'templates/grabbers/nzbget.html',
            controller: 'nzbgetCtrl'
          }
        }
      })

      .state('app.sabnzbd', {
        url: '/sabnzbd',
        views: {
          'menuContent': {
            templateUrl: 'templates/grabbers/sabnzbd.html',
            controller: 'sabnzbdCtrl'
          }
        }
      }

    );

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/nzb-manager/config');
  });
