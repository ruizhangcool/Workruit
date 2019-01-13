/**
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('candidateCardController', ['$scope', '$location', '$rootScope','logger', function($scope, $location, $rootScope,logger) {

  $scope.candidate = $rootScope.candidate;
}]);

