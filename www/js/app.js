// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('nzb-manager',
  [
    'ionic',
    'ionic-multiselect',
    'ionic-modal-select',
    'ngCordova',
    'lokijs',
    'mainModule'
  ]
)
  .config(function ($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position("bottom");
  })
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .constant('$ionicLoadingConfig', {
    template: '<ion-spinner icon="lines"></ion-spinner>'
  })
  .constant('sabnzbEndpoint', {
    url: 'http://localhost:8100/sabnzbd'
  })
  .constant('binsearchSearchEndpoint', {
    url: 'http://localhost:8100/binsearch'
  })
  .constant('findnzbSearchEndpoint', {
    url: 'http://localhost:8100/rss'
  })
  .constant('findnzbGetEndpoint', {
    url: 'http://localhost:8100/nzb'
  })
  .constant('nzbclubSearchEndpoint', {
    url: 'http://localhost:8100/nzbrss.aspx'
  })
  .constant('nzbsuApiEndpoint', {
    url: 'http://localhost:8100/api'
  })
  .constant('binnewsCategoryEndpoint', {
    url: 'http://localhost:8100/new_rss'
  })
;
