/**
 * @name: Mahesh
 * @company: Workruit
 *
 * performs the signup for the recruiters
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('editProfileController', ['$scope', '$http', '$location', 'workruitService','messageFactory','logger','HttpClientHelper',
                                            function($scope, $http, $location, workruitService,messageFactory,logger,HttpClientHelper) {
		// $scope.editProfile =  JSON.parse(localStorage.getItem("userData"));
    // $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
    // $scope.success=false;
    // $scope.error=false;
    //
    // $scope.$watch(
    //   function() { return messageFactory.getSuccess(); },
    //   function(newVal, oldVal) {
    //     if (messageFactory.getSuccess() === true) {
    //       $scope.success = true;
    //     }else{
    //       $scope.success = false;
    //     }
    //   },
    //   true
    // );
    //
    // $scope.$watch(
    //   function() { return messageFactory.getError(); },
    //   function(newVal, oldVal) {
    //     if (messageFactory.getError() === true) {
    //       $scope.error = true;
    //     }else{
    //       $scope.error = false;
    //     }
    //   },
    //   true
    // );
    //
	 //    logger.info("14 $scope.userdata-userId  "+ $scope.editProfile.userId);
    //
	 //    if ($scope.editProfile.userId === undefined){
    //
		// 	logger.info(" In editProfile :: $scope.userId "+$scope.userId);
    //
		// 	 if ($scope.userId === undefined){
		// 		 $scope.userId = localStorage.getItem("userId");
		// 		 logger.info("User Id From Local Storage :: "+$scope.userId);
		// 	 }
    //
	 //    }
	 //    else {
    //
	 //    	   if($scope.editProfile.jobRoleId==1){
		// 	    	//alert("Human Resources")
		// 			$scope.editProfile.jobRoleName = "Human Resources";
		// 		}
		// 		else if($scope.editProfile.jobRoleId==2){
		// 			//alert("Founder");
		// 			$scope.editProfile.jobRoleName = "Founder";
		// 		}else if($scope.editProfile.jobRoleId==3){
    //          //alert("Founder");
    //          $scope.editProfile.jobRoleName = "Employee";
    //        }
    //
	 //    }
    //
	 //    $scope.alert = alert;
    //
		// $scope.saveEditProfile = function() {
    //
		// 	logger.info("EDIT PROFILE JOBROLE ID : "+$scope.editProfile.jobRoleId);
		// 	logger.info("EDIT PROFILE JOBROLE name : "+$scope.editProfile.jobRoleName);
    //
		// 	if($scope.editProfile.jobRoleName=="Founder"){
		// 		$scope.editProfile.jobRoleId=2;
		// 		logger.info("Founder - JOB ROLE...");
		// 	}
		// 	else if ($scope.editProfile.jobRoleName=="Human Resources"){
		// 		$scope.editProfile.jobRoleId=1;
		// 		logger.info("Human Resources - JOB ROLE...");
		// 	}else if ($scope.editProfile.jobRoleName=="Employee"){
    //     $scope.editProfile.jobRoleId=3;
    //     logger.info("Human Resources - JOB ROLE...");
    //   }
		// 	else {
		// 		logger.info("INVALID JOB ROLE...");
		// 	}
    //
    //   var url =  baseUrl + '/api/user/'+$scope.editProfile.userId+'/updateRecruiterProfile';
    //   HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.editProfile)).then(function successCallback(response) {
		// 		if (response.status === 'success' ) {
		// 			$scope.nav.navBar = true;
    //
    //       localStorage.setItem("userData",JSON.stringify($scope.editProfile) );
		// 			$location.path( 'viewProfile' );
		// 		} else {
		// 			$scope.errorMessage = response.data.msg.description;
    //       $scope.error=true;
    //       messageFactory.setError(true);
		// 		}
		// 	});
    //
		// }

}]);
