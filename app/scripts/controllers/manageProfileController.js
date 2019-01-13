var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('manageProfileController', ['$scope', '$location', '$routeParams', '$http','messageFactory','logger','HttpClientHelper',
  function($scope, $location, $routeParams, $http,messageFactory,logger,HttpClientHelper) {

    $scope.errorMessage="";
     $scope.successMessage="";
    $scope.success=false;
    $scope.error=false;

    $scope.$watch(
      function() { return messageFactory.getSuccess(); },
      function(newVal, oldVal) {
        if (messageFactory.getSuccess() === true) {
          $scope.success = true;
        }else{
          $scope.success = false;
        }
      },
      true
    );

    $scope.$watch(
      function() { return messageFactory.getError(); },
      function(newVal, oldVal) {
        if (messageFactory.getError() === true) {
          $scope.error = true;
        }else{
          $scope.error = false;
        }
      },
      true
    );

    var key = $location.search().key;
  logger.info("Key--"+key);

    var url = baseUrl +baseUrl + 'email/emailprofile?key='+key;
    HttpClientHelper.ExecuteGetMethod(url)
      .then(function successCallback(response) {
      if (response.status === 'success' ) {

        logger.info(response.data);
        $scope.isApplicant = response.isApplicant;
        $scope.settings = response.data;

        //$scope.successMessage = response.data.msg.description;
        //$scope.success=true;
        //messageFactory.setSuccess(true);
      } else {
        $scope.errorMessage = response.msg.description;
        $scope.error=true;
        messageFactory.setError(true);
      }
    });


     $scope.saveSettings = function(){

       $scope.settings.key= key;
       var url = baseUrl + 'api/updateEmailProfile';
       HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.settings))
         .then(function successCallback(response) {
          if (response.status === 'success' ) {

            $scope.successMessage = response.msg.description;
            $scope.success=true;
            messageFactory.setSuccess(true);
          } else {
            $scope.errorMessage = response.msg.description;
            $scope.error=true;
            messageFactory.setError(true);
        }
        });
     };

	}]);
