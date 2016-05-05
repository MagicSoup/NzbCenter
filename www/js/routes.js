angular.module('nzb-manager')
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('app', {
        url: '/nzb-manager',
        cache: false,
        templateUrl: 'templates/menu.html',
        controller: 'mainCtrl'
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
        params: {
          query: {
            value: 'empty',
            squash: false
          },
          hiddenParam: 'YES'
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/search/engine/nzbclub.html',
            controller: 'searchWithNzbclubCtrl'
          }
        }
      })

      .state('app.searchWithFindnzb', {
        url: '/searchWithFindnzb',
        params: {
          query: {
            value: 'empty',
            squash: false
          },
          hiddenParam: 'YES'
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/search/engine/findnzb.html',
            controller: 'searchWithFindnzbCtrl'
          }
        }
      })

      .state('app.searchWithNzbsu', {
        url: '/searchWithNzbsu',
        params: {
          query: {
            value: 'empty',
            squash: false
          },
          hiddenParam: 'YES'
        },
        views: {
          'menuContent': {
            templateUrl: 'templates/search/indexer/nzbsu.html',
            controller: 'searchWithNzbsuCtrl'
          }
        }
      })

      .state('app.searchWithBinnews', {
        url: '/searchWithBinnews',
        views: {
          'menuContent': {
            templateUrl: 'templates/search/binnews.html',
            controller: 'searchWithBinnewsCtrl'
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
      })

      // setup an abstract state for the tabs directive
      .state('app.tab', {
        url: "/tab",
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: "templates/grabbers/tabs.html"
          }
        }
      })

      // Each tab has its own nav history stack:

      .state('app.tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/grabbers/tab-dash.html'
          }
        }
      })

      .state('app.tab.friends', {
        url: '/friends',
        views: {
          'tab-friends': {
            templateUrl: 'templates/grabbers/tab-friends.html'
          }
        }
      })

      .state('app.tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/grabbers/tab-account.html'
          }
        }
      })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/nzb-manager/config');
  });
