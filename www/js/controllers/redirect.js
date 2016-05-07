var mainModule = angular.module('mainModule');

mainModule.controller('redirectCtrl',
  function ($scope, $ionicPlatform, $ionicLoading, $ionicHistory, $state, configService) {

    $scope.config = {};

    $ionicPlatform.ready(function () {
      /*
       $ionicViewService.nextViewOptions({
       disableBack: true
       });
       */
      //$ionicLoading.show();
      configService.initDB();
      configService.getActualConfig()
        .then(function (actualConfig) {
          $scope.config = actualConfig;
          //$ionicLoading.hide();
          if ((typeof $scope.config.defaultPageId) != 'undefined' && $scope.config.defaultPageId != '') {
            $state.go($scope.config.defaultPageId)
          } else {
            $state.go('app.config');
          }
        });
    });
  }
);
