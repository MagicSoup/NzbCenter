var services = angular.module('services');

services.factory('htmlService',
  function () {

    var currentService = {};

    currentService.extractItemContent = function (item) {
      var data = {};
      if ((typeof item.enclosure != 'undefined')) {
        data = {
          'title': item.title.trim(),
          'publicationDate': item.pubDate,
          'link': item.enclosure._url,
          'description': item.description,
          'length': Math.floor(item.enclosure._length / 1024 / 1024) + ' Mo'
        };
      } else {
        data = {
          'title': item.title.trim(),
          'publicationDate': item.pubDate,
          'link': item.link,
          'description': item.description
        };
      }

      return data;
    };

    currentService.extractItemsForBinsearch = function (content) {
      var datas = [];
      var parser = new DOMParser();
      var doc = parser.parseFromString(content, "text/html");
      var trs = doc.evaluate( '//table[contains(@id, "r2")]//tr[@bgcolor]' ,doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
      for (var l = 0; l < trs.snapshotLength; l++){
        var tr = trs.snapshotItem(l);
      }
      return datas;
    };

    return currentService;
  }
);
