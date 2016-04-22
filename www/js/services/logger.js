var services = angular.module('services');

services.factory('loggerService', function () {
  var currentService = {};

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

  currentService.turnOn = function () {
    active = true;
  };

  currentService.turnOff = function () {
    active = false;
  };

  currentService.log = function (msg, type) {
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

  return currentService;
});
