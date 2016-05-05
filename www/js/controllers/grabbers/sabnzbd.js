var mainModule = angular.module('mainModule');

mainModule.controller('sabnzbdCtrl', [
    '$scope',
    '$state',
    'loggerService',
    'sabnzbdService',
    function ($scope, $state, loggerService, sabnzbdService) {

      $scope.queues = [];
      $scope.histories = [];

      $scope.initQueues = function () {
        console.log("initQueues");
        sabnzbdService.getServerQueues($scope.config.sabnzbd, 0, 20)
          .then(function (resp) {
            $scope.queues = extractQueueItems(resp.data.queue.slots);
          })
          .catch(function (error) {
            console.log(error.data);
          });

        $state.go('app.sabnzbd.queue');
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

      $scope.initHistory = function () {
        sabnzbdService.getServerHistory($scope.config.sabnzbd, 0, 20)
          .then(function (resp) {
            $scope.histories = extractHistoryItems(resp.data.history.slots);
          })
          .catch(function (error) {
            console.log(error.data);
          });
        $state.go('app.sabnzbd.history');
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

      function extractQueueItems(items) {
        var datas = [];

        angular.forEach(items, function (item) {
          console.log(item.status);
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
