'use strict';
angular.module('designCompare', ['famous.angular'])
  .config(['$compileProvider', function ($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|blob|file):|data:image\//);
  }])
  .controller('images', ['$scope', '$famous', function ($scope, $famous) {
    // Famous set up
    var EventHandler = $famous['famous/core/EventHandler'];

    $scope.myEventHandler = new EventHandler();
    $scope.imageEventHandler = new EventHandler();
    $scope.myEventHandler.on('imagechosen', function (file) {
      var reader = new FileReader();
      reader.onloadend = function () {
        $scope.images.push(reader.result);
        $scope.$apply();
      };
      reader.readAsDataURL(file);
    });
    $scope.imageEventHandler.pipe($scope.myEventHandler);
    // images handling.
    $scope.images = [];
  }])
  .directive('shImageInput', [function () {
    return {
      template: '<input type="file" accept="image/*">',
      restrict: 'E',
      replace: true,
      link: function (scope, element, attrs) {
        function imageChosen(event) {
          scope.imageEventHandler.emit('imagechosen', event.target.files[0]);
        }

        element.bind('change', imageChosen);
      }
    };
  }]);
