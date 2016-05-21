var services = angular.module('services');

services.factory('searchIndexerService',
  function ($http,
            $q,
            loggerService,
            rssService) {

    var currentService = {};
    //http://www.binsearch.info/?action=nzb&319051420=1
    function buildSearchUrl(baseUrl, apiKey, filter) {
      var searchUrl = baseUrl + '?apikey=' + apiKey + '&limit=10&t=search&o=xml&q=' + filter;
      return searchUrl;
    };

    currentService.search = function (baseUrl, apiKey, filter) {
      var deferred = $q.defer();
      var searchUrl = buildSearchUrl(baseUrl, apiKey, filter);
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
);
