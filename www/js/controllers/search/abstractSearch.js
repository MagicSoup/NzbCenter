var mainModule = angular.module('mainModule');

mainModule.controller('abstractSearchCtrl', [
    '$rootScope',
    '$scope',
    '$http',
    '$q',
    '$ionicLoading',
    '$ionicPopover',
    'configService',
    function ($rootScope,
              $scope,
              $http,
              $q,
              $ionicLoading,
              $ionicPopover,
              configService) {

      $scope.config = {};
      $scope.filters = {
        query: ''
      };
      $scope.datas = [];
      $scope.isFullyLoaded = false;

      $scope.$on('$ionicView.beforeEnter', function () {
        $scope.filters.query = '';
        $scope.datas = [];
        $scope.isFullyLoaded = false;
        configService.getActualConfig().then(function (actualConfig) {
          $scope.config = actualConfig;
        });
      });

      $scope.displayMessage = function(message, isError) {
        $rootScope.$broadcast('message:display', isError, message);
      }

      $scope.splashScreenHide = function() {
        //$ionicLoading.hide();
      };

      $scope.splashScreenShow = function() {
        //$ionicLoading.show();
      };

      var template =
        '<ion-popover-view style="height: 110px;">' +
        '<ion-content>' +
        '<div class="list">' +
        '<a class="item" ng-click="downloadUrlWithNzbget(link)" ng-show="config.nzbget.activated">Envoyer à Nzbget</a>' +
        '<a class="item" ng-click="downloadUrlWithSabnzbd(link)" ng-show="config.sabnzbd.activated">Envoyer à Sabnzbd</a>' +
        '</div>' +
        '</ion-content>' +
        '</ion-popover-view>';

      $scope.downloadPopover = $ionicPopover.fromTemplate(template, {
        scope: $scope
      });

      $scope.openDownloadPopover = function ($event, link) {
        $scope.downloadPopover.show($event);
        $scope.link = link;
      };

      $scope.closeDownloadPopover = function () {
        $scope.downloadPopover.hide();
      };

      $scope.$on('$destroy', function () {
        $scope.downloadPopover.remove();
      });
    }]
);
