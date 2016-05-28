var mainModule = angular.module('mainModule');

mainModule.controller('redirectCtrl', [
    '$scope',
    '$ionicPlatform',
    '$ionicLoading',
    '$ionicHistory',
    '$state',
    'configService',
    'loggerService',
    function ($scope, $ionicPlatform, $ionicLoading, $ionicHistory, $state, configService, loggerService) {

      $scope.config = {};
      loggerService.turnOn();
      console.log("NzbCenter : Redirect.js");

      $ionicPlatform.ready(function () {
        loggerService.turnOn();
        console.log("NzbCenter : Redirect.js");
        loggerService.log("Controller Redirect : call onready()");
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        loggerService.log("Controller Redirect : set history next view option disable back to true");
        configService.initDB();
        configService.getActualConfig()
          .then(
          function (actualConfig) {
            loggerService.log('Controller Redirect : loaded config');
            $scope.config = actualConfig;
            loggerService.log("Controller Redirect : load config to get defaultpage value : " + $scope.config.defaultPageId);
            if ((typeof $scope.config.defaultPageId) != 'undefined' && $scope.config.defaultPageId != '') {
              $state.go($scope.config.defaultPageId)
            }
            else {
              $state.go('app.config');
            }

          },
          function (errors) {
            loggerService.log("Controller Redirect : error when loading actual config" + errors.data, 'e');
          }
        );
      });
    }]
);
