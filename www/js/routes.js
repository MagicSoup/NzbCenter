angular.module('nzb-manager')
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('app', {
        url: '/example',
        abstract: true,
        templateUrl: 'templates/example/menu.html',
        controller: 'loginCtrl'
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

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/example/search.html'
          }
        }
      })
      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/example/browse.html'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/example/playlists.html',
            controller: 'playlistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/example/playlist.html',
            controller: 'playlistCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/example/playlists');
  });
