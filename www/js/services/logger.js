var services = angular.module('services');

services.factory('loggerService', function () {
  var logger = {};

  var active = false;

  var currentDateTime = function () {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + '/' +
      (currentdate.getMonth() + 1) + '/' +
      currentdate.getFullYear() + ' ' +
      currentdate.getHours() + ':' +
      currentdate.getMinutes() + ':' +
      currentdate.getSeconds();
    return datetime;
  }

  logger.turnOn = function () {
    active = true;
  };

  logger.turnOff = function () {
    active = false;
  };

  logger.log = function (msg, type) {
    var type = type || '';

    if (console && active) {
      var message = currentDateTime() + ' - ' + msg;

      switch (type) {
        case 'e':
          console.error(message);
          break;
        case 'w':
          console.warn(message);
          break;
        case 'd':
          console.debug(message);
          break;
        default:
          console.log(message);
          break;
      }
    }
  };

  return logger;
});
