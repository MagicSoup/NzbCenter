var services = angular.module('services');

services.factory('searchEngineService', [
  '$http',
  '$q',
  'loggerService',
  'rssService',
  function ($http,
            $q,
            loggerService,
            rssService) {

    var currentService = {};

    currentService.search = function (searchUrl) {
      var deferred = $q.defer();
      loggerService.turnOn();
      loggerService.log('Search url : ' + searchUrl);

      $http({
        method: 'GET',
        url: searchUrl
      })
        .success(function (resp) {
          var datas = rssService.extractItemsFromRss(resp);
          deferred.resolve(datas);
        })
        .error(function (err) {
          loggerService.log(err, 'e');
          deferred.reject(err);
        });

      return deferred.promise;
    };

    return currentService;
  }
]);
