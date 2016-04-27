var services = angular.module('services');

services.factory('searchEngineService', [
  '$http',
  '$q',
  'loggerService',
  function ($http, $q, loggerService) {

    var currentService = {};

    extractItemContent = function (item) {
      var data = {};
      if ((typeof item.enclosure != 'undefined')) {
        data = {
          'title': item.title.trim(),
          'publicationDate': item.pubDate,
          'link': item.enclosure._url,
          'length': Math.floor(item.enclosure._length / 1024 / 1024) + 'Mo'
        };
      } else {
        data = {
          'title': item.title.trim(),
          'publicationDate': item.pubDate,
          'link': item.link,
          'length': 0
        };
      }

      return data;
    };

    extractItemsFromChannel = function (channelJson) {
      var datas = [];
      if ((typeof channelJson.item.length == 'undefined')) {
        datas.push(extractItemContent(channelJson.item));
      } else {
        angular.forEach(channelJson.item, function (item) {
          datas.push(extractItemContent(item));
        });
      }
      return datas;
    };

    currentService.search = function (searchUrl) {
      var deferred = $q.defer();
      loggerService.turnOn();
      loggerService.log('Search url : ' + searchUrl);

      $http({
        method: 'GET',
        url: searchUrl
      })
        .success(function (resp) {
          var x2js = new X2JS();
          var channelJson = x2js.xml_str2json(resp).rss.channel;
          var datas = extractItemsFromChannel(channelJson);

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
