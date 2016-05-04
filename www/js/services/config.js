var services = angular.module('services');

services.factory('configService', ['$q', 'Loki', configService]);

function configService($q, Loki) {
  var _db;
  var _configs;

  function initDB() {
    _db = new Loki('configDB',
      {
        autosave: true,
        autosaveInterval: 1000
      });
  };

  function getConfigs() {

    return $q(function (resolve, reject) {

      var options = {
        configs: {
          proto: Object,
          inflate: function (src, dst) {
            var prop;
            for (prop in src) {
              if (prop === 'Date') {
                dst.Date = new Date(src.Date);
              } else {
                dst[prop] = src[prop];
              }
            }
          }
        }
      };

      _db.loadDatabase(options, function () {
        _configs = _db.getCollection('configs');

        if (!_configs) {
          _configs = _db.addCollection('configs');
        }

        resolve(_configs.data);
      });
    });
  };

  function getActualConfig() {
    return $q(function (resolve, reject) {
      var actualConfig = {};
      getConfigs().then(function (configs) {
        if (typeof configs[0] != 'undefined') {
          actualConfig = configs[0];
        }

        resolve(actualConfig);
      });
    });
  };

  function addConfig(config) {
    _configs.insert(config);
  };

  function updateConfig(config) {
    _configs.update(config);
  };

  function deleteConfig(config) {
    _configs.remove(config);
  };

  return {
    initDB: initDB,
    getConfigs: getConfigs,
    getActualConfig: getActualConfig,
    addConfig: addConfig,
    updateConfig: updateConfig,
    deleteConfig: deleteConfig
  };
}
