var services = angular.module('services');

services.factory('configService', ['$q', 'Loki', 'loggerService', configService]);

function configService($q, Loki, loggerService) {
  var _db;
  var _configs;

  loggerService.turnOn();

  function initDB() {
    loggerService.log("Service Config : call initDB()");
    _db = new Loki('configDB',
      {
        autosave: true,
        autosaveInterval: 1000
      });
  };

  function initConfigs() {
    loggerService.log("Service Config : call getConfigs()");

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
    });
  };

  function getDefaultConfig() {
    var config = {
      apikey: {
        activated: false
      },
      binnews: {
        activated: false
      },
      nzbget: {
        activated: false
      },
      sabnzbd: {
        activated: false
      },
      searchengine: {
        binsearch: {
          activated: false
        },
        findnzb: {
          activated: false
        },
        nzbclub: {
          activated: false
        }
      }
    };

    return config;
  }

  function getActualConfig() {
    var deferred = $q.defer();
    var actualConfig = null;
    loggerService.log("Service Config : call getActualConfig()");
    initConfigs();
    loggerService.log("Service Config : " + _configs.data.length + " configs founds");
    var isConfigAvailable = typeof _configs.data[0] != 'undefined';
    loggerService.log("Service Config : isConfigAvailable => " + isConfigAvailable);
    if (isConfigAvailable) {
      actualConfig = _configs.data[0];
    } else {
      actualConfig = getDefaultConfig();
    }
    deferred.resolve(actualConfig);
    return deferred.promise;
  };

  function addConfig(config) {
    loggerService.log("Service Config : call addConfig(config)");
    initConfigs();
    _configs.insert(config);
  };

  function updateConfig(config) {
    loggerService.log("Service Config : call updateConfig(config)");
    initConfigs();
    _configs.update(config);
  };

  function deleteConfig(config) {
    loggerService.log("Service Config : call deleteConfig(config)");
    initConfigs();
    _configs.remove(config);
  };

  return {
    initDB: initDB,
    getActualConfig: getActualConfig,
    getDefaultConfig: getDefaultConfig,
    addConfig: addConfig,
    updateConfig: updateConfig,
    deleteConfig: deleteConfig
  };
}
