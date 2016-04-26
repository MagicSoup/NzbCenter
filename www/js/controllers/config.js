var mainCtrl = angular.module('mainCtrl');

mainCtrl.controller('configCtrl', [
    '$scope',
    'loggerService',
    function ($scope, loggerService) {

      $scope.config = {
        apikey: {
          activated:false,
          nzbsu: 'nzbsu',
          nzbis: 'nzbis'
        },
        nzbget:{
          activated:false,
          url:'url_nzbget',
          username: 'user_nzbget',
          password: 'password_nzbget'
        },
        sabnzbd:{
          activated:false,
          url:'url_sabnzbd',
          username: 'user_sabnzbd',
          password: 'password_sabnzbd'
        }
      };
      //config..username

      $scope.submitConfig = function () {
        loggerService.turnOn();
      };
    }
  ]
);
