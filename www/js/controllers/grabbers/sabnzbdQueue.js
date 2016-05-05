var mainModule = angular.module('mainModule');

mainModule.controller('sabnzbdQueueCtrl', [
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
      $scope.queues = [];

      $scope.timer = null;

      $scope.startTimer = function () {
        $scope.timerActivated = true;
        $scope.timer = $interval(function () {
          console.log("timer queue called");
          $scope.initQueues();
        }, 5000);
      };

      $scope.stopTimer = function () {
        if (angular.isDefined($scope.timer)) {
          console.log("timer queue cancelled");
          $interval.cancel($scope.timer);
          $scope.timerActivated = false;
          $scope.timer = null;
        } else {
          console.log("timer queue is not defined");
        }
      };

      $scope.$on('$destroy', function () {
        $scope.stopTimer();
      });

      $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        console.log("$stateChangeStart from queue");
        if (fromState.name == 'app.sabnzbd.queue') {
          if ($scope.timer == null) {
            $scope.startTimer();
          } else {
            console.log("$stateChangeStart => stop queue timer");
            $scope.stopTimer();
          }
        }
      });

      $scope.$on('$ionicView.afterEnter', function (event, data) {
        if ($scope.timer == null) {
          $scope.startTimer();
        }
      });

      $scope.initQueues = function () {
        console.log("initQueue");

        sabnzbdService.getServerQueues($scope.config.sabnzbd, 0, 20)
          .then(function (resp) {
            $scope.queues = extractQueueItems(resp.data.queue.slots);
          })
          .catch(function (error) {
            console.log(error.data);
          });

        if (!$scope.timerActivated) {
          $scope.startTimer();
        }
      };

      $scope.pauseQueueItem = function (data) {
        sabnzbdService.pauseQueue($scope.config.sabnzbd, data.id)
          .then(function (resp) {
            console.log(resp.data);
            data.status = 'Paused';
          })
          .catch(function (error) {
            console.log(error.data);
          })
      };

      $scope.resumeQueueItem = function (data) {
        sabnzbdService.resumeQueue($scope.config.sabnzbd, data.id)
          .then(function (resp) {
            console.log(resp.data);
            data.status = 'Downloading';
          })
          .catch(function (error) {
            console.log(error.data);
          })
      };

      $scope.deleteQueueItem = function (data) {
        sabnzbdService.deleteQueue($scope.config.sabnzbd, data.id)
          .then(function (resp) {
            console.log(resp.data);
            $scope.initQueues();
          })
          .catch(function (error) {
            console.log(error.data);
          })
      };

      function extractQueueItems(items) {
        var datas = [];

        angular.forEach(items, function (item) {
          //console.log(item.status);
          var data = {
            id: item.nzo_id,
            name: item.filename,
            status: item.status,
            size: item.size,
            sizeleft: item.sizeleft,
            percentage: item.percentage,
            timeleft: item.timeleft
          };
          datas.push(data);
        });

        return datas;
      };
    }]
);
