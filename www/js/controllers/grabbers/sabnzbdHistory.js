var mainModule = angular.module('mainModule');

mainModule.controller('sabnzbdHistoryCtrl',
  function ($scope,
            $interval,
            $state,
            loggerService,
            sabnzbdService) {

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
      $scope.stopTimer();
    });

    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log("$stateChangeStart => stop history timer");
      $scope.stopTimer();
    });

    $scope.$on('$ionicView.beforeLeave', function (event, data) {
      console.log("$ionicView.beforeLeave history")
      if ($scope.timer != null) {
        $scope.stopTimer();
      }
    });

    $scope.initHistory = function () {
      console.log("initHistory");
      sabnzbdService.getServerHistory($scope.config.sabnzbd, 0, 20)
        .then(function (resp) {
          $scope.histories = extractHistoryItems(resp.data.history.slots);
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };

    $scope.deleteHistoryItem = function (data) {
      sabnzbdService.deleteHistory($scope.config.sabnzbd, data.id)
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
        var data = {
          id: item.nzo_id,
          name: item.name,
          nzbname: item.nzb_name,
          status: item.status,
          size: item.size
        };
        datas.push(data);
      });

      return datas;
    };
  }
);
