var services = angular.module('services');

services.factory('searchEngineService',
  function ($http,
            $q,
            loggerService,
            rssService,
            htmlService) {

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

    currentService.searchWithBinsearch = function (searchUrl) {
      var deferred = $q.defer();
      loggerService.turnOn();
      loggerService.log('Search url : ' + searchUrl);

      $http({
        method: 'GET',
        url: searchUrl
      })
        .success(function (resp) {
          var datas = htmlService.extractItemsForBinsearch(resp);
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
);
