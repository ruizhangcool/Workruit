/**
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('resetPasswordController', ['$scope','$routeParams', '$location', 'workruitService', '$http','messageFactory','HttpClientHelper',
  '$window','logger', function($scope,$routeParams, $location, workruitService, $http,messageFactory,HttpClientHelper,$window,logger) {

  $scope.resetEmail="";
  $scope.userdata =  JSON.parse(localStorage.getItem("userData"));
  $scope.success=false;
  $scope.error=false;
  $scope.submitted = false;

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


  $scope.sendResetPasswordMail = function(formValid){
    $scope.submitted = true;

    if(!formValid) return;
    var map = {};
    map.username = $scope.resetEmail;

    var url = baseUrl + 'api/resetPasswordLinkToEmail';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify(map)).then(function successCallback(response) {
      console.info(response);
      if (response.status === 'success' ) {
        $scope.successMessage = response.msg.description;
        $scope.success=true;
        messageFactory.setSuccess(true);
      } else {
        console.info(response.msg.description);
        $scope.errorMessage = response.msg.description;
        $scope.error=true;
        messageFactory.setError(true);
      }
    });
	};


  $scope.resetPassword = function() {

    var url = baseUrl + '/api/user/'+$scope.userdata.userId+'/updateUserPassword';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.editProfile)).then(function successCallback(response) {
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
	}

	$scope.alert = alert;
	$scope.userId = $routeParams.userId;

	$scope.resetPasswordNewServCall = function() {

    var url = baseUrl + '/api/user/'+$scope.userId+'/resetPasswordNew';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.resetPasswordNew))
      .then(function successCallback(response) {
			if (response.status === 'success' ) {
				//$scope.nav.navBar = true;
				//$location.path( 'welcome' );
				$scope.successMessage = response.msg.description;
        $scope.success=true;
        messageFactory.setSuccess(true);

        var userAgent = navigator.userAgent;
        logger.info("----"+userAgent);
        if(userAgent.match(/Android/i)){
          logger.info("inside android");
          $window.location.href = "https://workruit.com/download.html";
        }else if(userAgent.match(/iPhone|iPad|iPod/i)){
          logger.info("inside iphone");
          $window.location.href  = "https://workruit.com/download.html";
        }
			} else {
				$scope.errorMessage = response.msg.description;
        $scope.error=true;
        messageFactory.setError(true);
			}
		});

	}





  $scope.createPasswordNewServCall = function() {

    //alert("resetPasswordNew  : " +$scope.userId);
    var url = baseUrl + '/api/user/'+$scope.userId+'/resetPasswordNew';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.resetPasswordNew))
      .then(function successCallback(response) {
      if (response.status === 'success' ) {
        //$scope.nav.navBar = true;
        //$location.path( 'welcome' );
        $scope.successMessage = response.msg.description;
        $scope.success=true;
        messageFactory.setSuccess(true);

        var userAgent = navigator.userAgent;
        logger.info("----"+userAgent);
        if(userAgent.match(/Android/i)){
          logger.info("inside android");
          $window.location.href = "https://workruit.com/download.html";
        }else if(userAgent.match(/iPhone|iPad|iPod/i)){
          logger.info("inside iphone");
          $window.location.href  = "https://workruit.com/download.html";
        }else{
          logger.info("inside browser");
          $location.path( '/' );
        }

      } else {
        $scope.errorMessage = response.msg.description;
        $scope.error=true;
        messageFactory.setError(true);
      }
    });

  }

}]);
