var services = angular.module('services');

services.factory('nzbgetService',
  function ($http, base64) {

    var currentService = {};

    function getBasicAuth(username, password) {
      return base64.encode(username + ':' + password);
    }

    currentService.getServerConfig = function (configParam) {

      var url = configParam.url + '/jsonrpc/config';

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.getListOfGroups = function (configParam) {

      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "listgroups",
        "params": [0],
        "id": 1
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    currentService.getListOfFiles = function (configParam, groupId) {

      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "listFiles",
        "params": [0, 0, groupId],
        "id": 1
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    currentService.getServerHistory = function (configParam, showHidden) {

      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "history",
        "params": [showHidden],
        "id": 1
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    currentService.sendNzbFile = function (configParam, nzbFilename, nzbUrl) {

      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "append",
        "params": [
          nzbFilename.endsWith('nzb') ? nzbFilename : nzbFilename + '.nzb',
          encodeURI(nzbUrl),
          configParam.category,
          0,
          false,
          false,
          "key",
          0,
          "Force"
        ],
        "id": 1
      };

      if ((typeof version == 'undefined') || version > 16) {
        data.params.push("");
      }

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    currentService.pauseDownload = function (configParam) {

      var url = configParam.url + '/jsonrpc/pausedownload';

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.resumeDownload = function (configParam) {

      var url = configParam.url + '/jsonrpc/resumedownload';

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.deleteQueue = function (configParam, idQueue) {
      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "editqueue",
        "params": ["GroupDelete", 0, "", [idQueue]],
        "id": 1
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    currentService.pauseQueue = function (configParam, idQueue) {
      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "editqueue",
        "params": ["GroupPause", 0, "", [idQueue]],
        "id": 1
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    currentService.resumeQueue = function (configParam, idQueue) {
      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "editqueue",
        "params": ["GroupResume", 0, "", [idQueue]],
        "id": 1
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    currentService.deleteHistory = function (configParam, idHistory) {
      var url = configParam.url + '/jsonrpc';
      var version = configParam.version;
      var data = {
        "method": "editqueue",
        "params": ["HistoryDelete", 0, "", [idHistory]],
        "id": 1
      };

      return $http({
        method: 'POST',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        },
        data: data
      });
    };

    return currentService;
  }
);
