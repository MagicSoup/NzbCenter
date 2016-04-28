var services = angular.module('services');

services.factory('rssService', [
  function () {

    var currentService = {};

    currentService.extractItemContent = function (item) {
      var data = {};
      if ((typeof item.enclosure != 'undefined')) {
        data = {
          'title': item.title.trim(),
          'publicationDate': item.pubDate,
          'link': item.enclosure._url,
          'length': Math.floor(item.enclosure._length / 1024 / 1024) + ' Mo'
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

    currentService.extractItemsFromRss = function (content) {
      var datas = [];
      var x2js = new X2JS();
      var channelJson = x2js.xml_str2json(content).rss.channel;
      if ((typeof channelJson.item.length == 'undefined')) {
        datas.push(currentService.extractItemContent(channelJson.item));
      } else {
        angular.forEach(channelJson.item, function (item) {
          datas.push(currentService.extractItemContent(item));
        });
      }
      return datas;
    };

    return currentService;
  }
]);
