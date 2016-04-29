var services = angular.module('services');

services.factory('searchBinnewsService', [
  '$http',
  '$q',
  'loggerService',
  'rssService',
  function ($http,
            $q,
            loggerService,
            rssService) {

    var categories = [
      {categoryId: 20, categoryName: "Jeux"},
      {categoryId: 21, categoryName: "Patches/DLC"},
      {categoryId: 3, categoryName: "Apps ISO"},
      {categoryId: 5, categoryName: "Apps RIP"},
      {categoryId: 32, categoryName: "Autres OS"},
      {categoryId: 43, categoryName: "GPS"},
      {categoryId: 106, categoryName: "Mobiles"},
      {categoryId: 6, categoryName: "Films"},
      {categoryId: 23, categoryName: "Films DVD"},
      {categoryId: 39, categoryName: "Films HD"},
      {categoryId: 27, categoryName: "Anime"},
      {categoryId: 48, categoryName: "Anime DVD"},
      {categoryId: 49, categoryName: "Anime HD"},
      {categoryId: 100, categoryName: "VO Films"},
      {categoryId: 101, categoryName: "VO Films DVD"},
      {categoryId: 102, categoryName: "VO Films HD"},
      {categoryId: 103, categoryName: "VO Anime VO"},
      {categoryId: 104, categoryName: "VO Anime DVD"},
      {categoryId: 105, categoryName: "VO Anime HD"},
      {categoryId: 7, categoryName: "Séries"},
      {categoryId: 26, categoryName: "Séries DVD"},
      {categoryId: 44, categoryName: "Séries HD"},
      {categoryId: 56, categoryName: "VO Séries"},
      {categoryId: 59, categoryName: "VO Séries HD"},
      {categoryId: 11, categoryName: "Docs / Actu"},
      {categoryId: 47, categoryName: "Emissions"},
      {categoryId: 36, categoryName: "Spectacles"},
      {categoryId: 37, categoryName: "Sports"},
      {categoryId: 24, categoryName: "TV Anime"},
      {categoryId: 52, categoryName: "TV Anime DVD"},
      {categoryId: 53, categoryName: "TV Anime HD"},
      {categoryId: 28, categoryName: "GameCube"},
      {categoryId: 54, categoryName: "Rétro"},
      {categoryId: 34, categoryName: "DS"},
      {categoryId: 10, categoryName: "PSX"},
      {categoryId: 9, categoryName: "PS2"},
      {categoryId: 33, categoryName: "PSP"},
      {categoryId: 42, categoryName: "PSP Vidéo"},
      {categoryId: 12, categoryName: "XBox"},
      {categoryId: 40, categoryName: "PS3"},
      {categoryId: 45, categoryName: "PS3 Vidéo"},
      {categoryId: 35, categoryName: "XBox 360"},
      {categoryId: 57, categoryName: "Xbox One"},
      {categoryId: 58, categoryName: "PS4"},
      {categoryId: 41, categoryName: "Wii"},
      {categoryId: 60, categoryName: "Wii U"},
      {categoryId: 55, categoryName: "3DS"},
      {categoryId: 8, categoryName: "Mp3"},
      {categoryId: 51, categoryName: "Lossless"},
      {categoryId: 30, categoryName: "DVD Zik"},
      {categoryId: 31, categoryName: "Vidéo Zik"},
      {categoryId: 25, categoryName: "Ebook"},
      {categoryId: 46, categoryName: "Ero"},
      {categoryId: 16, categoryName: "XXX"}];

    var currentService = {};

    currentService.getCategories = function () {
      return categories;
    };

    currentService.loadCategory = function (baseUrl, categoryId) {
      var deferred = $q.defer();
      var categoryUrl = buildCategoryUrl(baseUrl, categoryId);
      loggerService.turnOn();
      loggerService.log('Category url : ' + categoryUrl);

      $http({
        method: 'GET',
        url: categoryUrl
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

    function buildCategoryUrl(baseUrl, categoryId) {
      var categoryUrl = baseUrl + '/cat-' + categoryId + '.html';
      return categoryUrl;
    };

    return currentService;
  }
]);
