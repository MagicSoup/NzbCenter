var services = angular.module('services');

services.factory('htmlService',
  function () {

    var currentService = {};

    function extractTdTextContent(content) {
      var contentMap = {};
      var contentSplit = content.split('collection size:');
      contentMap['title'] = contentSplit[0].trim();

      var sizeSplit = contentSplit[1].split(',');
      contentMap['size'] = sizeSplit[0].trim();

      return contentMap;
    };

    function extractTrNodeContent(trNode) {
      var data = 'undefined';
      if ((typeof trNode != 'undefined') && trNode.cells.length > 3) {
        var tdDataNode = trNode.cells[2];
        var mapContent = extractTdTextContent(tdDataNode.textContent);
        data = {
          'title': mapContent['title'],
          'publicationDate': '',
          'link': '',
          'description': '',
          'length': mapContent['size']
        };
      }

      return data;
    };

    currentService.extractItemsForBinsearch = function (content) {
      var datas = [];
      var parser = new DOMParser();
      var doc = parser.parseFromString(content, "text/html");
      var trs = doc.evaluate('//table[contains(@id, "r2")]//tr[@bgcolor]', doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var l = 0; l < trs.snapshotLength; l++) {
        var tr = trs.snapshotItem(l);
        var data = extractTrNodeContent(tr);
        if((typeof data != 'undefined')){
          datas.push(data);
        }
      }
      return datas;
    };

    return currentService;
  }
);
