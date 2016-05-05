var mainModule = angular.module('mainModule');

mainModule.controller('nzbgetHistoryCtrl', [
    '$scope',
    '$interval',
    '$state',
    'loggerService',
    'sabnzbdService',
    function ($scope,
              $interval,
              $state,
              loggerService,
              sabnzbdService) {

      $scope.timerActivated = false;
      $scope.histories = [];

      $scope.startTimer = function () {
        $scope.timerActivated = true;
        $scope.timer = $interval(function () {
          console.log("timer history called");
          $scope.initHistory(false);
        }, 15000);
      };

      $scope.stopTimer = function () {
        if (angular.isDefined($scope.timer)) {
          console.log("timer history cancelled");
          $interval.cancel($scope.timer);
          $scope.timerActivated = false;
          $scope.timer = null;
        } else {
          console.log("timer history is not defined");
        }
      };

      $scope.$on('$destroy', function () {
        $scope.stopTimer();
      });

      $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        console.log("$stateChangeStart from history");
        if (fromState.name == 'app.sabnzbd.history') {
          if ($scope.timer == null) {
            $scope.startTimer();
          } else {
            console.log("$stateChangeStart => stop history timer");
            $scope.stopTimer();
          }
        }
      });

      $scope.$on('$ionicView.afterEnter', function (event, data) {
        if ($scope.timer == null) {
          $scope.startTimer();
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

        if (!$scope.timerActivated) {
          $scope.startTimer();
        }

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
    }]
);
