var workruitApp = angular.module('workruitUiApp');
	workruitApp.controller('loginController', ['$scope', '$location', 'HttpClientHelper', '$rootScope','messageFactory','logger',
    function($scope, $location, HttpClientHelper, $rootScope,messageFactory,logger) {
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

    $scope.validateLogin = function(formValid) {
      $scope.submitted = true;
      if(!formValid) return;

      var fcmToken = localStorage.getItem("fcm_token");
      localStorage.removeItem("sessionId");
      var jsonReq = {};
      jsonReq.username=$scope.email;
      jsonReq.password=$scope.passwd;
      jsonReq.role="recruiter";
      jsonReq.regdId = (fcmToken == null ) ? "NA" : fcmToken;
      logger.info(JSON.stringify(jsonReq));
      var url =baseUrl + 'api/dashboardLogin';
      HttpClientHelper.ExecutePostMethod(url,JSON.stringify(jsonReq)).then(function successCallback(response) {
						if (response.status === 'success' ) {
							$scope.userdata = response.data;
							logger.info("login - "+$scope.userdata.userId);
							logger.info("sessionId - "+response.sessionId);
							localStorage.setItem("sessionId",response.sessionId);
              localStorage.setItem("userData",JSON.stringify(response.data));
              localStorage.setItem("userId",response.data.userId);
							$rootScope.userdata = response.data;
              $scope.error=false;
              messageFactory.setError(false);
							if ($scope.userdata.status === 2) {
								$scope.errorMessage = "Please validate your email to continue."
                $scope.error=true;
                messageFactory.setError(true);
							} else if (Object.keys($scope.userdata.company).length == 0) {
								$scope.nav.navBar = true;
								$location.path( 'company/'+$scope.userdata.recruiterCompanyName+"/"+$scope.userdata.userId );
							}else if ($scope.userdata.company.companyIndustriesSet.length==0) {
                $scope.nav.navBar = true;
                $location.path( 'company/'+$scope.userdata.recruiterCompanyName+"/"+$scope.userdata.userId );
              }else {
								$scope.nav.navBar = true;
                var imagePath = response.data.company.picture;


                localStorage.setItem("companyImage",imagePath);
								$location.path( 'applicants' );
							}
						} else {
							$scope.errorMessage = response.msg.description;
              $scope.error=true;
              messageFactory.setError(true);
						}
					}, function (error) {
            $scope.errorMessage = "Something wrong with the action, please try again";
          $scope.error=true;
          messageFactory.setError(true);
					});
		};

	}]);
