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

      .state('app.sabnzbd', {
        url: '/sabnzbd',
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/grabbers/sabnzbd.html'
          }
        }
      })

      .state('app.sabnzbd.queue', {
        url: '/queue',
        views: {
          'tab-sabnzbd-queue': {
            templateUrl: 'templates/grabbers/sabnzbd-queue.html',
            controller: 'sabnzbdQueueCtrl'
          }
        }
      })

      .state('app.sabnzbd.history', {
        url: '/history',
        views: {
          'tab-sabnzbd-history': {
            templateUrl: 'templates/grabbers/sabnzbd-history.html',
            controller: 'sabnzbdHistoryCtrl'
          }
        }
      })

      .state('app.nzbget', {
        url: '/nzbget',
        abstract: true,
        views: {
          'menuContent': {
            templateUrl: 'templates/grabbers/nzbget.html',
            controller: 'nzbgetCtrl'
          }
        }
      })

      .state('app.nzbget.queue', {
        url: '/queue',
        views: {
          'tab-nzbget-queue': {
            templateUrl: 'templates/grabbers/nzbget-queue.html'
          }
        }
      })

      .state('app.nzbget.history', {
        url: '/history',
        views: {
          'tab-nzbget-history': {
            templateUrl: 'templates/grabbers/nzbget-history.html'
          }
        }
      })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/nzb-manager/config');
  });
