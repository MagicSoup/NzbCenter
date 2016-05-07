var mainModule = angular.module('mainModule');

mainModule.controller('nzbgetHistoryCtrl',
  function ($scope,
            $interval,
            $state,
            loggerService,
            nzbgetService) {

    $scope.histories = [];

    $scope.startTimer = function () {
      $scope.timer = $interval(function () {
        console.log("timer history called");
        $scope.initHistory(false);
      }, 15000);
    };

    $scope.stopTimer = function () {
      if (angular.isDefined($scope.timer)) {
        console.log("timer history cancelled");
        $interval.cancel($scope.timer);
        $scope.timer = null;
      } else {
        console.log("timer history is not defined");
      }
    };

    $scope.$on('$destroy', function () {
      console.log("$destroy history");
      $scope.stopTimer();
    });

    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log("$stateChangeStart => stop history timer");
      $scope.stopTimer();
    });

    $scope.$on('$ionicView.afterEnter', function (event, data) {
      console.log("$ionicView.afterEnter history")
      if ($scope.timer == null) {
        $scope.startTimer();
      }
    });

    $scope.initHistory = function () {
      console.log("initHistory");
      nzbgetService.getServerHistory($scope.config.nzbget)
        .then(function (resp) {
          $scope.histories = extractHistoryItems(resp.data.result);
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };

    $scope.deleteHistoryItem = function (data) {
      nzbgetService.deleteHistory($scope.config.nzbget, data.id)
        .then(function (resp) {
          console.log(resp.data);
          $scope.initHistory();
        })
        .catch(function (error) {
          console.log(error.data);
        })
    };

    function extractHistoryItems(items) {
      var datas = [];

      angular.forEach(items, function (item) {
        var status = item.Status.split('/')[0];
        var data = {
          id: item.NZBID,
          name: item.NZBName,
          filename: item.NZBFilename,
          status: status,
          size: item.FileSizeMB,
          sizeleft: item.RemainingSizeMB,
          timeleft: item.PostStageTimeSec
        };
        datas.push(data);
      });

      return datas;
    };
  }
);
