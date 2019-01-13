/**
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('activityController', ['$scope','$http', '$location', 'workruitService','messageFactory','$routeParams', 'HttpClientHelper',
  function($scope, $http, $location, workruitService,messageFactory,$routeParams,HttpClientHelper) {

  $scope.alert = alert;

  $scope.userdata =  JSON.parse(localStorage.getItem("userData"));
  $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
  $scope.message=2;
  $scope.success=false;
  $scope.error=false;
  $scope.job= {};

  $scope.recruiterInterestedProfilesLength =0;
  $scope.recruiterApplicantMatchesLength =0;

  $scope.tab = 'interested';
  if($routeParams.tab){
    $scope.tab = $routeParams.tab;
  }

  $scope.tabSelected = function(tab) {
    $scope.tab = tab;
  };

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

  //$scope.masterdata = workruitService.masterdata;

  console.log("Activity Controller : 11 $scope.userdata-userId  "+ $scope.userdata.userId);

  if ($scope.userdata.userId === undefined){

    console.log("Hello You Are In Init :: "+$scope.userId);

    if ($scope.userId === undefined){
      $scope.userId = localStorage.getItem("userId");
      console.log("User Id From Local Storage :: "+$scope.userId);
    }

  }





  $scope.loadAllLikedProfiles = function(){
    $scope.message=2;
    $scope.tab = 'interested';

    $scope.candidate = workruitService.candidateProfile;
    $scope.job = workruitService.userJobs;
    console.log($scope.candidate);
    var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/recruiterApplicantMatches';
    HttpClientHelper.ExecuteGetMethod(url).then(
      function (response) {
        //$scope.nav.activeTab = "activity";
        if (response.status === 'success' ) {

          //$scope.shortListedProfiles = JSON.parse(response.data);

          $scope.recruiterApplicantMatches = response.data;
          $scope.recruiterApplicantMatchesLength = $scope.recruiterApplicantMatches.length;
        }

      }, function (error) {
        $scope.errorMessage = "Something wrong with the action, please try again";
        $scope.error=true;
        messageFactory.setError(true);
      });

    var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/recruiterInterestedProfiles';
    HttpClientHelper.ExecuteGetMethod(url).then(
      function (response) {
        //$scope.nav.activeTab = "activity";
        if (response.status === 'success' ) {

          //$scope.shortListedProfiles = JSON.parse(response.data);

          $scope.recruiterInterestedProfiles = response.data;
          $scope.recruiterInterestedProfilesLength = $scope.recruiterInterestedProfiles.length;

          if ($scope.recruiterInterestedProfiles.length>0) {
            $scope.message=1;
          } else {
            $scope.nav.navBar = true;
            $scope.message=0;
            //$scope.message="No Jobs";
          }
        } else {
          $scope.errorMessage = response.msg;
          $scope.error=true;
          messageFactory.setError(true);
        }

      }, function (error) {
        $scope.errorMessage = "Something wrong with the action, please try again";
        $scope.error=true;
        messageFactory.setError(true);
      })
  }

  $scope.showMatched = function _showMatched(isMatched){
    if (isMatched) {
      $scope.message=2;
      $scope.tab = 'matched';
      console.log("matched");
      $scope.candidate = workruitService.candidateProfile;
      $scope.job = workruitService.userJobs;
      console.log($scope.candidate);

      var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/recruiterInterestedProfiles';
      HttpClientHelper.ExecuteGetMethod(url).then(
        function (response) {
          //$scope.nav.activeTab = "activity";
          if (response.status === 'success' ) {

            //$scope.shortListedProfiles = JSON.parse(response.data);

            $scope.recruiterInterestedProfiles = response.data;
            $scope.recruiterInterestedProfilesLength = $scope.recruiterInterestedProfiles.length;
          }
        }, function (error) {
          $scope.errorMessage = "Something wrong with the action, please try again";
          $scope.error=true;
          messageFactory.setError(true);
        })

      var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/recruiterApplicantMatches';
      HttpClientHelper.ExecuteGetMethod(url).then(
        function (response) {
          //$scope.nav.activeTab = "activity";
          if (response.status === 'success' ) {

            //$scope.shortListedProfiles = JSON.parse(response.data);

            $scope.recruiterApplicantMatches = response.data;
            $scope.recruiterApplicantMatchesLength = $scope.recruiterApplicantMatches.length;

            if ($scope.recruiterApplicantMatches.length>0) {
              $scope.message=1;
            } else {
              $scope.nav.navBar = true;
              $scope.message=0;
            }
          } else {
            $scope.errorMessage = response.msg;
            $scope.error=true;
            messageFactory.setError(true);
          }

        }, function (error) {
          $scope.errorMessage = "Something wrong with the action, please try again";
          $scope.error=true;
          messageFactory.setError(true);
        });

    }
    else {
      $scope.tab = 'interested';
      console.log("interested");
      $scope.message=2;
      $scope.loadAllLikedProfiles();

    }

  }

  $scope.filterMatched = function(jobMatch){
    return jobMatch.jobseekerStatus && jobMatch.recruiterStatus;
  }

  $scope.editPostJob = function(jobsData) {
    jobsData.jobFunction = ""+jobsData.jobFunction[0];
    jobsData.location = ""+jobsData.location.locationId;
    jobsData.jobType=""+jobsData.jobType.jobTypeId;
    jobsData.experienceMax = ""+jobsData.experienceMax;
    jobsData.experienceMin = ""+jobsData.experienceMin;
    workruitService.userEditJobs = jobsData;
    workruitService.isFromEditPost = true;
    localStorage.setItem("editJobId",jobsData.jobPostId);
    $location.path( 'editPostjob' );
  };


  $scope.loadFullProfile = function _loadFullProfile(profiles,jobData) {
    console.log("loadFullProfile");
    console.log("profiles: ", profiles);
    console.log("jobData: ", jobData);

    workruitService.candidateProfile = profiles;
    workruitService.userJobs = jobData;
    console.log(jobData);
    $location.path('applicantsProfile');
  }

  $scope.loadFullProfileInterested = function _loadFullProfileInterested(profiles,jobData) {
    console.log("loadFullProfileInterested");
    workruitService.candidateProfile = profiles;
    workruitService.userJobs = jobData;
    $location.path('applicantsInterestedProfile');
  }

  $scope.getJobFunctionName = function(jobFunctionId) {
    var i=0;
    for(i;i<$scope.masterData.jobFunctions.length;i++) {
      if ($scope.masterData.jobFunctions[i].jobFunctionId === jobFunctionId[0])
        return $scope.masterData.jobFunctions[i].jobFunctionName;
    }
    return "";
  }



  if($scope.tab == undefined || $scope.tab==='interested'){

    $scope.loadAllLikedProfiles();
  }else{
    $scope.showMatched(true);
  }


  $scope.doPublish = function (){
    publish();
  }

  $scope.loadInterested = function(){
    $scope.tab = 'interested';
    $location.url('activity?tab=interested');
  }

  $scope.loadMatched = function(){
    $scope.tab = 'matched';
    $location.url('activity?tab=matched');
  }

    $scope.loadSendMessage = function _loadFullProfile(profiles,jobData) {
      console.log("loadSendMessage");

      workruitService.candidateProfile = profiles;
      workruitService.userJobs = jobData;
      console.log(jobData);
      $location.path('messages');
    }



}]);
