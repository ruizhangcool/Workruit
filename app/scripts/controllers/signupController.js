/**
 * @name: Mahesh
 * @company: Workruit
 *
 * performs the signup for the recruiters
 *
 */

var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('signupController', ['$scope', '$http', '$location', 'workruitService', 'messageFactory','logger','$base64','$crypto',
  function($scope, $http, $location, workruitService,messageFactory,logger,$base64,$crypto) {
	$scope.errorMessage = "";// do
  $scope.companyList = [];
  $scope.OriginalcompanyList = [];
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
  $scope.emailDomains=["@gmail","@yahoo","@yahoomail","@rediff","@outlook","@hotmail"];
  var companyMasterData =JSON.parse(localStorage.getItem("masterData"));
  $scope.masterData=JSON.parse(localStorage.getItem("masterData"));
  var companyMasterData = companyMasterData.companyNameId;
  logger.info(companyMasterData.length);

  for (var i =0; i< companyMasterData.length;i++ ){
    $scope.companyList.push(companyMasterData[i].masterCompanyName);
    $scope.OriginalcompanyList.push(companyMasterData[i].masterCompanyName);
  }


	$scope.signUpRecruiter = function(formValid) {
    localStorage.removeItem("sessionId");

    $scope.submitted = true;
    if(!formValid) return;

    // do Validation and return
		if (!$scope.validateFormData()) {
			$scope.errorMessage = "Required fields missing";
      $scope.error=true;
      messageFactory.setError(true);
			return false;
		}

    for(var p=0;p<$scope.emailDomains.length;p++){
      if ($scope.user.email.indexOf($scope.emailDomains[p]) != -1) {
        $scope.errorMessage = "Invalid email";
        $scope.error=true;
        messageFactory.setError(true);
        return false;
      }
    }

		var jobRoleObj = {};
		jobRoleObj={"jobRoleId":$scope.user.jobRole};
		$scope.user.jobRole = jobRoleObj;

		$scope.user.status = null;

		$scope.user.deviceType = "NA";
		$scope.user.regdId = "NA";
    $scope.user.dashboardRegdId = (localStorage.getItem("fcm_token") == null ) ? "NA" : localStorage.getItem("fcm_token") ;
    var auth = $base64.encode("admin:workruit$");
    console.log(localStorage.getItem("sessionId"));
    var encrypted = $crypto.encrypt(JSON.stringify($scope.user), (localStorage.getItem("sessionId")== null) ? "password" : localStorage.getItem("sessionId"));

		$http({
			method: 'POST',
      Authorization : 'Basic ' + auth,
      headers: {
        'Token': '94b51cc4-0c99-11e7-93ae-92361f002671'
      },
			url: baseUrl + 'api/recruiterSignup',
			data:encrypted,
      transformResponse: undefined
		}).then(function successCallback(response) {
      logger.info(response);
      var decrypted = $crypto.decrypt(response.data);
      logger.info(decrypted);
			decrypted = JSON.parse(decrypted);
      if (decrypted.status === 'success' ) {

				//Setting the token to the localStorage
        logger.info(response.data);
        localStorage.setItem("sessionId",decrypted.data.sessionId);
        localStorage.setItem("userId",decrypted.data.userId);

				logger.info("43 - User Device Type : "+$scope.user.deviceType);
				logger.info("44 - User Regd Id : "+$scope.user.regdId);
         var userIdOld = decrypted.data.userId;
        $http({
          method: 'GET',
          Authorization : 'Basic ' + auth,
          headers: {
            'Token': localStorage.getItem("sessionId")
          },
          transformResponse: undefined,
          url: baseUrl + '/api/user/'+decrypted.data.userId+'/getRecruiterProfile'
        }).success(function successCallback(response) {
          logger.info(response);
          var decryptedInner = $crypto.decrypt(response,(localStorage.getItem("sessionId")== null) ? "password" : localStorage.getItem("sessionId"));
          decryptedInner = JSON.parse(decryptedInner);
          $scope.userdata = decryptedInner.data;
          $scope.userdata.userId = userIdOld;
          localStorage.setItem("userData",JSON.stringify(decryptedInner.data));
        }).error(function errorCallback(response) {

        });

				//This is written only for Dashboard
				$location.path( 'verifyemail' );

			} else {
				$scope.errorMessage = decrypted.msg.description;
        $scope.error=true;
        messageFactory.setError(true);
			}
		}, function errorCallback(response) {
      console.log(response);
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	};

	$scope.validateFormData = function() {
		return true;
	}

	$scope.viewUserProfile = workruitService.userdata;
	 if (workruitService.userdata) {
		 $scope.user = workruitService.userdata;
	 }

	$scope.editProfile = function _editProfile(userProfile) {
		$location.path( 'editProfile' );
	}


  $scope.updateCompanies = function(typed){
    var matches = [];
    $scope.cl = $scope.OriginalcompanyList;
    $scope.companyList =[];
    $scope.cl.forEach(function(company) {

      if ((company.toLowerCase().startsWith(typed.toString().toLowerCase())) ) {
       // logger.info(company+"--"+typed);
        $scope.companyList.push(company);
      }
    });
  }


}]);
