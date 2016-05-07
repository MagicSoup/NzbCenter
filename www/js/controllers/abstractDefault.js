var mainModule = angular.module('mainModule');

mainModule.controller('abstractDefaultCtrl',
  function ($rootScope,
            $scope,
            $ionicLoading) {

    $scope.displayMessage = function (message) {
      $rootScope.$broadcast('message:display', "balanced", message);
    }

    $scope.displayWarningMessage = function (message) {
      $rootScope.$broadcast('message:display', "energized", message);
    }

    $scope.displayErrorMessage = function (message) {
      $rootScope.$broadcast('message:display', "assersive", message);
    }

    $scope.splashScreenHide = function () {
      $ionicLoading.hide();
    };

    $scope.splashScreenShow = function () {
      $ionicLoading.show();
    };
  }
);
