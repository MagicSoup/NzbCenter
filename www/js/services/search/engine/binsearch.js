var services = angular.module('services');

services.factory('binsearchService', [
  '$http',
  'loggerService',
  'binsearchEndpoint',
  function ($http, loggerService, binsearchEndpoint) {

    var currentService = {};

    currentService.search = function (title) {
      var searchUrl = buildSearchUrl(binsearchEndpoint, title);
      loggerService.turnOn();
      loggerService.log('Search url : ' + searchUrl);
      return $http({
        method: 'POST',
        url: searchUrl
      })
    };

    return currentService;
  }
]);
function buildSearchUrl(endpoint, filter) {
  var searchUrl = endpoint.url + '/?q=' + filter + '&max=100&adv_age=1100';
  return searchUrl;
}
