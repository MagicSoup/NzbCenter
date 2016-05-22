var mainModule = angular.module('mainModule');

mainModule.controller('nzbgetQueueCtrl',
  function ($scope,
            $interval,
            $state,
            loggerService,
            nzbgetService) {

    $scope.queues = [];

    $scope.timer = null;

    $scope.startTimer = function () {
      $scope.timer = $interval(function () {
        console.log("timer queue called");
        $scope.initQueues();
      }, 5000);
    };

    $scope.stopTimer = function () {
      if (angular.isDefined($scope.timer)) {
        console.log("timer queue cancelled");
        $interval.cancel($scope.timer);
        $scope.timer = null;
      } else {
        console.log("timer queue is not defined");
      }
    };

    $scope.$on('$destroy', function () {
      console.log("$destroy history");
      $scope.stopTimer();
    });

    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
      console.log("$stateChangeStart => stop queue timer");
      $scope.stopTimer();
    });

    $scope.$on('$ionicView.afterEnter', function (event, data) {
      console.log("$ionicView.afterEnter queue");
      if ($scope.timer == null) {
        $scope.startTimer();
      }
    });

    $scope.initQueues = function () {
      console.log("initQueue");

      nzbgetService.getListOfGroups($scope.config.nzbget)
        .then(function (resp) {
          $scope.queues = extractQueueItems(resp.data.result);
        })
        .catch(function (error) {
          console.log(error.data);
        });
    };

    $scope.pauseQueueItem = function (data) {
      nzbgetService.pauseQueue($scope.config.nzbget, data.id)
        .then(function (resp) {
          console.log(resp.data);
          data.status = 'Paused';
        })
        .catch(function (error) {
          console.log(error.data);
        })
    };

    $scope.resumeQueueItem = function (data) {
      nzbgetService.resumeQueue($scope.config.nzbget, data.id)
        .then(function (resp) {
          console.log(resp.data);
          data.status = 'Downloading';
        })
        .catch(function (error) {
          console.log(error.data);
        })
    };

    $scope.deleteQueueItem = function (data) {
      nzbgetService.deleteQueue($scope.config.nzbget, data.id)
        .then(function (resp) {
          console.log(resp.data);
          $scope.initQueues();
        })
        .catch(function (error) {
          console.log(error.data);
        })
    };

    $scope.moveUpQueueItem = function(data){
      loggerService.turnOn();
      nzbgetService.moveQueueUp($scope.config.nzbget, data.id);
    };

    $scope.moveDownQueueItem = function(data){
      loggerService.turnOn();
      nzbgetService.moveQueueDown($scope.config.nzbget, data.id);
    };

    function extractQueueItems(items) {
      var datas = [];

      angular.forEach(items, function (item) {
        var data = {
          id: item.NZBID,
          name: item.NZBName,
          filename: item.NZBFilename,
          status: item.Status,
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
