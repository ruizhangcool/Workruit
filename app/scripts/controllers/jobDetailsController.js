/**
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('jobDetailsController', ['$scope', '$location', 'workruitService','$http','messageFactory', 'logger','HttpClientHelper',
  function($scope, $location, workruitService,$http,messageFactory,logger,HttpClientHelper) {

	var JOBS_DATA = {
			PENDING_APPROVAL: {value: 0, name: "Pending Approval", code: "M"},
			ACTIVE : {value: 1, name: "Active", code: "S"},
			CLOSE : {value: 2, name: "Close", code: "L"}
	};

  $scope.success=false;
  $scope.error=false;
  $scope.jobType = 0;

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

	$scope.nav.activeTab = workruitService.activeTab;
	//$scope.nav.activeTab = "jobs";
  $scope.activeCount=2;
  $scope.pendingCount=2;
  $scope.closedCount=2;

  $scope.activeLength= localStorage.getItem("activeLength") ? parseInt(localStorage.getItem("activeLength")) : 0;
  $scope.pendingLength= localStorage.getItem("pendingLength") ? parseInt(localStorage.getItem("pendingLength")) : 0;
  $scope.closedLength= localStorage.getItem("closedLength") ? parseInt(localStorage.getItem("closedLength")) : 0;
  $scope.masterData = JSON.parse(localStorage.getItem("masterData"));

	$scope.loadAllJobs = function(){
		//$scope.userJobData = workruitService.userJobs;
		logger.info("workruitService.userdata.userId :: "+workruitService.userdata.userId);

		if(workruitService.userdata.userId===undefined){
			logger.info("workruitService.userdata.userId - undefined");
			//Check the below line
			workruitService.userdata.userId = localStorage.getItem("userId");
			logger.info("workruitService.userdata.userId - from storage - "+workruitService.userdata.userId);
		}

    var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/viewPostedJobs';
    HttpClientHelper.ExecuteGetMethod(url).then(
				function (response) {
					//$scope.nav.activeTab = "jobs";
					if (response.status === 'success' ) {

						//logger.info("1 st jobPostId : "+response.data[0].jobPostId);
						//logger.info("1 st description : "+response.data[0].description);

						//$scope.userJobData = JSON.parse(response.data);

            //Filter Job and add expire date.
            var jobData = response.data;
            for(var i = 0; i < jobData.length; i++) {
              var item = jobData[i];
              var createdDate = new Date(item["createdDate"]);
              var expireDays = item["expireDays"];
              if(expireDays < 0) {
                expireDays = 0;
              }
              item["expire_date"] = createdDate.setDate(createdDate.getDate() + expireDays);
            }

						$scope.userJobData = jobData;
            logger.info("Jobs", $scope.userJobData);
						$scope.userPendingJobData = $scope.userJobData;

            var al=0,pl=0,cl=0;

            for(var i=0;i<$scope.userJobData.length;i++){
              if($scope.userJobData[i].status == 1 || $scope.userJobData[i].status == 4){
                $scope.pendingCount=1;
                pl=pl +1;

              }
              if($scope.userJobData[i].status == 2){
                $scope.activeCount=1;
                al = al + 1;


              }
              if($scope.userJobData[i].status == 3){
                $scope.closedCount=1;
                cl = cl + 1;

              }
            }
            $scope.pendingLength = pl;
            $scope.activeLength = al;
            $scope.closedLength = cl;

            localStorage.setItem("pendingLength",$scope.pendingLength);
            localStorage.setItem("activeLength",$scope.activeLength);
            localStorage.setItem("closedLength",$scope.closedLength);

            if($scope.activeCount ==2){
              $scope.activeCount =0;
            }
            if($scope.pendingCount ==2){
              $scope.pendingCount =0;
            }
            if($scope.closedCount ==2){
              $scope.closedCount =0;
            }


						if ($scope.userJobData) {
							logger.info(""+$scope.userJobData)
						} else {
							$scope.nav.navBar = true;
							$scope.message="No Jobs";
							//$location.path( 'welcome' );
						}
					} else {
						$scope.errorMessage = response.msg;
            $scope.error=true;
            messageFactory.setError(true);
					}

				}, function (error) {
					console.error("FATAL ERROR");
					console.error(error);
				});

	}

	$scope.getJobFunctionName = function(jobFunctionId) {
		var i=0;
		for(i;i<$scope.masterData.jobFunctions.length;i++) {
			if ($scope.masterData.jobFunctions[i].jobFunctionId === jobFunctionId[0])
				return $scope.masterData.jobFunctions[i].jobFunctionName;
		}
		return "";
	}

	$scope.getJobStatus = function(statusCode) {
		if (statusCode === JOBS_DATA.ACTIVE.value)
			return JOBS_DATA.ACTIVE.name;
		if (statusCode === JOBS_DATA.PENDING_APPROVAL.value)
			return JOBS_DATA.PENDING_APPROVAL.name;
		if (statusCode === JOBS_DATA.CLOSE.value)
			return JOBS_DATA.CLOSE.name;
	}

	$scope.editPostJob = function(jobsData) {

		logger.info("--editPostJob--");
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

  $scope.viewClosePostjob = function(jobsData) {

    logger.info("--viewClosePostjob--");
    jobsData.jobFunction = ""+jobsData.jobFunction[0];

    jobsData.location = ""+jobsData.location.locationId;
    jobsData.jobType=""+jobsData.jobType.jobTypeId;
    jobsData.experienceMax = ""+jobsData.experienceMax;
    jobsData.experienceMin = ""+jobsData.experienceMin;
    workruitService.userEditJobs = jobsData;
    workruitService.isFromEditPost = true;
    localStorage.setItem("editJobId",jobsData.jobPostId);
    $location.path( 'closePostjob' );

  };

  $scope.closePostJob = function(jobsData) {

    logger.info("--editPostJob--");
    //jobsData.jobFunction = ""+jobsData.jobFunction[0];

    var r = confirm("Do you want to delete the job :"+jobsData.title);
    if (r == true) {
      jobsData.status = 3;

      //jobsData.location = ""+jobsData.location.locationId;
      //jobsData.jobType=""+jobsData.jobType.jobTypeId;
      jobsData.experienceMax = ""+jobsData.experienceMax;
      jobsData.experienceMin = ""+jobsData.experienceMin;
      jobsData.createdDate="";
      jobsData.updatedDate="";
      workruitService.userEditJobs = jobsData;
      //workruitService.isFromEditPost = true;
      localStorage.setItem("closeJobId",jobsData.jobPostId);

      var url = baseUrl + '/api/user/'+localStorage.getItem("userId")+'/postjob';
      HttpClientHelper.ExecutePostMethod(url,JSON.stringify(jobsData)).then(
        function successCallback(response) {
        $location.path( 'closed' );
      });
    } else {
      return;
    }

  };

	$scope.loadAllJobs();

	$scope.changeJobType = function(index) {
    $scope.jobType = index;
  };
}]);
