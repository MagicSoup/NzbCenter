var services = angular.module('services');

services.factory('binsearchService', [
  '$http',
  '$q',
  'loggerService',
  'binsearchEndpoint',
  function ($http, $q, loggerService, binsearchEndpoint) {

    var currentService = {};

    currentService.search = function (title) {
      var deferred = $q.defer();
      var searchUrl = buildSearchUrl(binsearchEndpoint, title);
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
            datas.push({'title': item.title, 'publicationDate': item.pubDate, 'link': item.link});
          });
          deferred.resolve(datas);
        })
        .error(function (err) {
          loggerService.log(err, 'e');
          deferred.reject(err);
        });

      return deferred.promise
    };

    return currentService;
  }
]);
function buildSearchUrl(endpoint, filter) {
  var searchUrl = endpoint.url + '?q=' + filter + '&sort=agedesc&max=10&g=*';
  return searchUrl;
}
