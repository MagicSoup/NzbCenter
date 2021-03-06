var services = angular.module('services');

services.factory('htmlService',
  function () {

    var currentService = {};

    function extractTdTextContentForBinsearch(content) {
      var contentMap = {};
      var contentSplit = content.split('collection size:');
      contentMap['title'] = contentSplit[0].trim();

      var sizeSplit = contentSplit[1].split(',');
      contentMap['size'] = sizeSplit[0].trim();

      return contentMap;
    };

    function extractTrNodeContentForBinsearch(trNode) {
      var data = {init: false};
      if ((typeof trNode != 'undefined') && trNode.cells.length >= 3) {
        var idContent = trNode.cells[1].firstChild.name;
        var tdDataNode = trNode.cells[2];
        var tdAgeNode = trNode.cells[3];
        if (!tdDataNode.textContent.startsWith('The posts below')) {
          var mapContent = extractTdTextContentForBinsearch(tdDataNode.textContent);
          var downloadLink = "http://www.binsearch.info/?action=nzb&" + idContent + "=1"
          data = {
            'init': true,
            'title': mapContent['title'],
            'age': tdAgeNode.innerText,
            'link': downloadLink,
            'length': mapContent['size']
          };
        }
      }

      return data;
    };

    currentService.extractItemsForBinsearch = function (content) {
      var datas = [];
      var parser = new DOMParser();
      var doc = parser.parseFromString(content, "text/html");
      var trs = doc.evaluate('//table[contains(@id, "r2")]//tr[@bgcolor]', doc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      for (var l = 1; l < trs.snapshotLength; l++) {
        var tr = trs.snapshotItem(l);
        var data = extractTrNodeContentForBinsearch(tr);
        if (data.init) {
          datas.push(data);
        }
      }
      return datas;
    };

    return currentService;
  }
);
