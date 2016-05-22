var mainModule = angular.module('mainModule');

mainModule.controller('redirectCtrl',
  function ($scope, $ionicPlatform, $ionicLoading, $ionicHistory, $state, configService) {

    $scope.config = {};

    $ionicPlatform.ready(function () {

      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      configService.initDB();
      configService.getActualConfig()
        .then(function (actualConfig) {
          if (actualConfig != null) {
            $scope.config = actualConfig;
            if ((typeof $scope.config.defaultPageId) != 'undefined' && $scope.config.defaultPageId != '') {
              $state.go($scope.config.defaultPageId)
            }
            else {
              $state.go('app.config');
            }
          }
          else {
            $state.go('app.config');
          }
        });
    });
  }
);
