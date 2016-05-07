var mainModule = angular.module('mainModule');

mainModule.controller('redirectCtrl', [
    '$scope',
    '$ionicPlatform',
    '$ionicLoading',
    '$state',
    'configService',
    function ($scope, $ionicPlatform, $ionicLoading, $state, configService) {

      $scope.config = {};

      $ionicPlatform.ready(function () {
        /*
         $ionicVewService.nextViewOptions({
         disableBack: true
         });
         */
        $ionicLoading.show();
        configService.initDB();
        configService.getActualConfig()
          .then(function (actualConfig) {
            $scope.config = actualConfig;
            $ionicLoading.hide();
            if ((typeof $scope.config.defaultPageId) != 'undefined' && $scope.config.defaultPageId != '') {
              $state.go($scope.config.defaultPageId)
            } else {
              $state.go('app.config');
            }
          });
      });
    }]
);
