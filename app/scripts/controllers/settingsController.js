var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('settingsController', ['$scope', '$location', 'workruitService', '$http','messageFactory','logger','HttpClientHelper',
  function($scope, $location, workruitService, $http,messageFactory,logger,HttpClientHelper) {


    $scope.userdata =  JSON.parse(localStorage.getItem("userData"));
    $scope.recruiterSettings = $scope.userdata.recruiterSettings;
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

    var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/getRecruiterProfile';
    HttpClientHelper.ExecuteGetMethod(url).then(function successCallback(response) {
      if (response.status === 'success' ) {

        logger.info(response.data);
        //setting cache data
        $scope.userdata.recruiterSettings= response.data.recruiterSettings;
        localStorage.setItem("userData",JSON.stringify($scope.userdata) );
        $scope.recruiterSettings = $scope.userdata.recruiterSettings;

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
       logger.info("Saving recruiter settings: "+JSON.stringify($scope.recruiterSettings));
       var map = {};
       map.recruiterSettings = $scope.recruiterSettings;
       map.recruiterSettings.newCandidates.email = map.recruiterSettings.newCandidates.email ? 1 :0;
       map.recruiterSettings.newCandidates.mobile = map.recruiterSettings.newCandidates.mobile ? 1 :0;

       map.recruiterSettings.someoneInterested.email = map.recruiterSettings.someoneInterested.email ? 1 :0;
       map.recruiterSettings.someoneInterested.mobile = map.recruiterSettings.someoneInterested.mobile ? 1 :0;

       map.recruiterSettings.newMatch.email = map.recruiterSettings.newMatch.email ? 1 :0;
       map.recruiterSettings.newMatch.mobile = map.recruiterSettings.newMatch.mobile ? 1 :0;

       map.recruiterSettings.jobIsActive.email = map.recruiterSettings.jobIsActive.email ? 1 :0;
       map.recruiterSettings.jobIsActive.mobile = map.recruiterSettings.jobIsActive.mobile ? 1 :0;

       map.recruiterSettings.jobIsClosed.email = map.recruiterSettings.jobIsClosed.email ? 1 :0;
       map.recruiterSettings.jobIsClosed.mobile = map.recruiterSettings.jobIsClosed.mobile ? 1 :0;

       var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/updateRecruiterSettings';
       HttpClientHelper.ExecutePostMethod(url,JSON.stringify(map)).then(function successCallback(response) {
          if (response.status === 'success' ) {

            //setting cache data
            $scope.userdata.recruiterSettings= $scope.recruiterSettings;
            localStorage.setItem("userData",JSON.stringify($scope.userdata) );

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
