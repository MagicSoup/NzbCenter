var services = angular.module('services');

services.factory('searchEngineService', [
  '$http',
  '$q',
  'loggerService',
  function ($http, $q, loggerService) {

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
          var datas = [];

          var x2js = new X2JS();
          var channelJson = x2js.xml_str2json(resp).rss.channel;
          angular.forEach(channelJson.item, function (item) {
            if ((typeof item.enclosure != 'undefined')) {
              var data = {
                'title': item.title,
                'publicationDate': item.pubDate,
                'link': item.enclosure._url,
                'length': item.enclosure._length
              };
              datas.push(data);
            } else {
              var data = {
                'title': item.title,
                'publicationDate': item.pubDate,
                'link': item.link,
                'length': 0
              };
              datas.push(data);
            }
          });
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
