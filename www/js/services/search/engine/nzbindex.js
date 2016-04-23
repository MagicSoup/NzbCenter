var services = angular.module('services');

services.factory('nzbindexService', [
  '$http',
  'loggerService',
  'nzbindexEndpoint',
  function ($http, loggerService, nzbindexEndpoint) {

    var currentService = {};

    currentService.search = function () {
      var searchUrl = buildSearchUrl(nzbindexEndpoint, 'johnossi');
      loggerService.turnOn();
      loggerService.log('Search url : ' + searchUrl);
      return $http({
        method: 'GET',
        url: searchUrl
      })
    };

    return currentService;
  }
]);
function buildSearchUrl(endpoint, filter) {
  var searchUrl = endpoint.url + '/?q=' + filter + '&max=100&sort=agedesc';
  return searchUrl;
}
