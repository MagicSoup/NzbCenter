var services = angular.module('services');

services.factory('sabnzbdService',
  function ($http, base64) {

    var currentService = {};

    function getBasicAuth(username, password) {
      return base64.encode(username + ':' + password);
    }

    currentService.getServerVersion = function (configParam) {
      // available since version 0.4
      var url = configParam.url + '/api?mode=version&apikey=' + configParam.apikey + "&output=json";

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.getServerConfig = function (configParam) {
      // available since version 0.4
      var url = configParam.url + '/api?mode=get_config&apikey=' + configParam.apikey + "&output=json";

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.sendNzbFile = function (configParam, nzbFilename, nzbUrl) {

      var url = configParam.url + '/api?mode=addurl&name=' + encodeURIComponent(nzbUrl) + '&nzbname=' + nzbFilename + '&apikey=' + configParam.apikey;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.getServerQueues = function (configParam, start, limit) {
      // available since version 0.5
      var url = configParam.url + '/api?mode=queue&start=' + start + '&limit=' + limit + '&apikey=' + configParam.apikey + "&output=json";

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.getServerHistory = function (configParam, start, limit) {
      // available since version 0.5
      var url = configParam.url + '/api?mode=history&start=' + start + '&limit=' + limit + '&apikey=' + configParam.apikey + "&output=json";

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.getServerWarningData = function (configParam) {
      // available since version 0.4
      var url = configParam.url + '/api?mode=warnings&apikey=' + configParam.apikey + "&output=json";

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.getServerCategories = function (configParam) {
      // available since version 0.4
      var url = configParam.url + '/api?mode=get_cats&apikey=' + configParam.apikey + "&output=json";

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.restartServer = function (configParam) {
      // available since version 0.5
      var url = configParam.url + '/api?mode=restart&apikey=' + configParam.apikey;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.deleteQueue = function (configParam, idQueue) {
      // available since version 0.5
      var url = configParam.url + '/api?mode=queue&name=delete&apikey=' + configParam.apikey + "&value=" + idQueue;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.deleteAllQueues = function (configParam) {
      return currentService.deleteQueue(configParam, 'all');
    };

    currentService.pauseQueue = function (configParam, idQueue) {
      // available since version 0.3
      var url = configParam.url + '/api?mode=queue&name=pause&apikey=' + configParam.apikey + '&value=' + idQueue;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.pauseAllQueues = function (configParam) {
      // available since version 0.3
      var url = configParam.url + '/api?mode=pause&apikey=' + configParam.apikey;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.resumeQueue = function (configParam, idQueue) {
      // available since version 0.3
      var url = configParam.url + '/api?mode=queue&name=resume&apikey=' + configParam.apikey + '&value=' + idQueue;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.resumeAllQueues = function (configParam) {
      // available since version 0.3
      var url = configParam.url + '/api?mode=resume&apikey=' + configParam.apikey;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.deleteHistory = function (configParam, idHistory) {
      // available since version 0.3
      var url = configParam.url + '/api?mode=history&name=delete&apikey=' + configParam.apikey + "&value=" + idHistory;

      return $http({
        method: 'GET',
        url: url,
        headers: {
          'Authorization': 'Basic ' + getBasicAuth(configParam.username, configParam.password)
        }
      });
    };

    currentService.deleteAllHistory = function (configParam) {
      return currentService.deleteHistory(configParam, 'all');
    };

    return currentService;
  }
);

