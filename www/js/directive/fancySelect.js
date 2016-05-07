var mainModule = angular.module('nzb-manager');

mainModule.directive('fancySelect',
  function ($ionicModal) {
    return {
      /* Only use as <fancy-select> tag */
      restrict: 'E',

      /* Our template */
      templateUrl: 'js/directive/fancy-select.html',

      /* Attributes to set */
      scope: {
        'items': '=', /* Items list is mandatory */
        'text': '=', /* Displayed text is mandatory */
        'value': '=', /* Selected value binding is mandatory */
        'callback': '&'
      },

      link: function (scope, element, attrs) {

        /* Default values */
        scope.multiSelect = attrs.multiSelect === 'true' ? true : false;
        scope.allowEmpty = attrs.allowEmpty === 'false' ? false : true;

        /* Header used in ion-header-bar */
        scope.headerText = attrs.headerText || '';

        /* Text displayed on label */
        // scope.text          = attrs.text || '';
        scope.defaultText = scope.text || '';

        /* Optionnal callback function */
        // scope.callback = attrs.callback || null;

        /* Instanciate ionic modal view and set params */

        /* Some additionnal notes here :
         *
         * In previous version of the directive,
         * we were using attrs.parentSelector
         * to open the modal box within a selector.
         *
         * This is handy in particular when opening
         * the "fancy select" from the right pane of
         * a side view.
         *
         * But the problem is that I had to edit ionic.bundle.js
         * and the modal component each time ionic team
         * make an update of the FW.
         *
         * Also, seems that animations do not work
         * anymore.
         *
         */
        $ionicModal.fromTemplateUrl('js/directive/fancy-select-items.html', {'scope': scope})
          .then(function (modal) {
            scope.modal = modal;
          });

        scope.$watch(scope.items, function () {
          var text = scope.text;
          var containsValues = initFromCheckedValues();
          if (!containsValues) {
            scope.text = text;
          }
        });

        function initFromCheckedValues() {
          var containsValues = false;

          // Clear values
          scope.value = '';
          scope.text = '';

          // Loop on items
          angular.forEach(scope.items, function (item) {
            if (item.checked) {
              containsValues = true;
              scope.value = scope.value + item.id + ';';
              scope.text = scope.text + item.text + ', ';
            }
          });

          // Remove trailing comma
          scope.value = scope.value.substr(0, scope.value.length - 1);
          scope.text = scope.text.substr(0, scope.text.length - 2);

          return containsValues;
        };


        /* Validate selection from header bar */
        scope.validate = function (event) {
          // Construct selected values and selected text
          if (scope.multiSelect == true) {
            initFromCheckedValues();
          }

          // Select first value if not nullable
          if (typeof scope.value == 'undefined' || scope.value == '' || scope.value == null) {
            if (scope.allowEmpty == false) {
              scope.value = scope.items[0].id;
              scope.text = scope.items[0].text;

              // Check for multi select
              scope.items[0].checked = true;
            } else {
              scope.text = scope.defaultText;
            }
          }

          // Hide modal
          scope.hideItems();

          // Execute callback function
          if (typeof scope.callback == 'function') {
            scope.callback(scope.value);
          }
        }

        /* Show list */
        scope.showItems = function (event) {
          event.preventDefault();
          scope.modal.show();
        }

        /* Hide list */
        scope.hideItems = function () {
          scope.modal.hide();
        }

        /* Destroy modal */
        scope.$on('$destroy', function () {
          scope.modal.remove();
        });

        /* Validate single with data */
        scope.validateSingle = function (item) {

          // Set selected text
          scope.text = item.text;

          // Set selected value
          scope.value = item.id;

          // Hide items
          scope.hideItems();

          // Execute callback function
          if (typeof scope.callback == 'function') {
            scope.callback(scope.value);
          }
        }
      }
    };
  }
);
