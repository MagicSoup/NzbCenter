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
      console.log("NzbCenter : Apps.js")
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
    url: 'https://campi-nas.net/sabnzbd'
  })
  .constant('binsearchSearchEndpoint', {
    url: 'http://binsearch.info/'
  })
  .constant('findnzbSearchEndpoint', {
    url: 'http://findnzb.net/rss'
  })
  .constant('findnzbGetEndpoint', {
    url: 'http://findnzb.net/nzb'
  })
  .constant('nzbclubSearchEndpoint', {
    url: 'https://www.nzbclub.com/nzbrss.aspx'
  })
  .constant('nzbsuApiEndpoint', {
    url: 'https://api.nzb.su/api'
  })
  .constant('binnewsCategoryEndpoint', {
    url: 'http://www.binnews.in/new_rss'
  })
;
