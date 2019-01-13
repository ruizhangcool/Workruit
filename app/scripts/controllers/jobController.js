/**
 *
 */
var workruitApp = angular.module('workruitUiApp');


workruitApp.controller('jobController', ['$scope','$rootScope','$http', '$location', 'workruitService','$q','$filter',
  'messageFactory','logger','HttpClientHelper',
  function($scope,$rootScope, $http, $location, workruitService,$q,$filter,messageFactory,logger,HttpClientHelper)
  {
    $scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    $scope.years = [];
    $scope.min_experience = makeArray(0, 19);
    $scope.max_experience = makeArray(1, 20);
    $scope.min_salary = makeArray(0, 49);
    $scope.max_salary = makeArray(1, 50);
    $scope.submitted = false;

    $scope.jobFunctionSkills = [];
    $scope.masterJobFunctionSkills = [];
    $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
    $scope.jobFunctionsArr = [];
    $scope.jobFunctionOptions = [];

    function makeArray(min, max) {
      var array = [];
      var index = 0;
      for(var i = min; i <= max; i++)
      {
        array[index] = i;
        index ++;
      }

      return array;
    }
    if($scope.masterData.categoryArray){
      angular.forEach($scope.masterData.categoryArray, function(value, key) {
        if(value.categoryValues.length > 0){
          $scope.jobFunctionsArr.push(value);
        }else{
          $scope.jobFunctionOptions.push(value);
        }
      });
    }

    $scope.success=false;
    $scope.error=false;
    $scope.showPostjobFrom=true;
    $scope.isShow = false;

    $scope.expSlider = {
      min: 0,
      max: 20,
      options: {
        floor: 0,
        ceil: 20,
        step: 1,
        precision: 1,
        enforceStep: false,
        translate: function (value) {
                return  value + '.0';
        }
      }
    };

    $scope.salSlider = {
      min: 0,
      max: 50,
      options: {
        floor: 0,
        ceil: 50,
        step: 0.1,
        precision: 1,
        enforceStep: false
      }
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

     var year = new Date().getFullYear();
     $scope.years .push(year.toString());
     for (var i = 1; i < (3); i++) {
       $scope.years .push((year + i).toString());
     }

	  $scope.superheroesModel = angular.copy($rootScope.superheroesModel);

		 //$rootScope.superheroesModel = $scope.superheroesModel;

		  $scope.tags = [];

     function containsObject(obj, list) {
       var i;
       for (i = 0; i < list.length; i++) {
         if (list[i] === obj) {
           return true;
         }
       }

       return false;
     }


     function removeObject(obj, list) {
       var i;
       for (i = 0; i < list.length; i++) {
         if (list[i] === obj) {
           $scope.jobFunctionSkills.splice(i, 1);
           return;
         }
       }

       return false;
     }

     $scope.tagRemoved = function(tag) {
       logger.info('Tag removed: ', tag);
       if(!containsObject(tag,$scope.jobFunctionSkills)){
         if(containsObject(tag,$scope.masterJobFunctionSkills)){
           $scope.jobFunctionSkills.push(tag);
         }
       }
     };

     $scope.blurMethod = function(tag) {
       logger.info(document.querySelector('#jobSkills .tags input'));
      var value  =  angular.element(document.querySelector('#jobSkills .tags input')).attr("class");
       logger.info(value);
       if(value.indexOf("ng-not-empty") !== -1){
         $scope.isShow = true;
       }else{
         $scope.isShow = false;
       }
     };



      $scope.addSkill = function(skillName){

        var found = false;
        for(var i = 0; i < $scope.tags.length; i++) {
          if ($scope.tags[i] == skillName) {
            found = true;
            break;
          }
        }
       // if($scope.tags.)
        if(!found){
          $scope.tags.push(skillName);
          removeObject(skillName,$scope.jobFunctionSkills);
        }
      };


		  $scope.loadTags = function($query) {
        logger.info("Tags loading ....");
        var param = {};
        param["page"] =0;
        param["size"] =15;
        var url = baseUrl + 'api/skills?page=0&size=30&skillName='+$query;

        return  HttpClientHelper.ExecuteGetMethod(url).then(function(response) {
          var skills = response.content;
          var formatterSkills = [];

          for(var i=0;i<skills.length;i++){
            formatterSkills.push(skills[i].skillName);
          }
          return formatterSkills.filter(function(skill) {
            return skill.toLowerCase().indexOf($query.toLowerCase()) != -1;
          });
        });
		  };

	$scope.job = {};

	$scope.job.skills = [];

	//$scope.nav.activeTab = "jobs";

	$scope.savePostJob = function() {

	  logger.info("Save Post");
    $scope.submitted = true;

    // Job Title Validate.
    if($scope.job.title == null || $scope.job.title.length == 0) {
      return;
    }

    //Function
    if($scope.job.jobFunction == null || $scope.job.jobFunction.length == 0) {
      return;
    }

    //Location
    if($scope.job.location == null || $scope.job.location.length == 0) {
      return;
    }

    //Description
    if($scope.job.description == null || $scope.job.description.length == 0) {
      return;
    }

    //Skills
    if($scope.tags == null || $scope.tags.length < 3) {
      return;
    }

    //Setting slider values
    $scope.job.salaryMin=$scope.salSlider.min;
    $scope.job.salaryMax=$scope.salSlider.max;
    $scope.job.experienceMin=$scope.expSlider.min;
    $scope.job.experienceMax = $scope.expSlider.max;

    logger.info($scope.job.unpaid);
    logger.info($scope.job.salaryMin +"--"+$scope.job.salaryMax);

    //Validate salary
    if($scope.job.jobType !=3  && (parseInt($scope.job.salaryMin) > parseInt($scope.job.salaryMax))){
      $scope.errorMessage = "Salary is not valid";
      $scope.error=true;
      messageFactory.setError(true);
      return false;
    }

    //Validate salary
    if($scope.job.jobType ==3 && !$scope.job.unpaid && (parseInt($scope.job.salaryMin) > parseInt($scope.job.salaryMax))){
      $scope.errorMessage = "Salary is not valid";
      $scope.error=true;
      messageFactory.setError(true);
      return false;
    }

    //Validate experience
    if($scope.job.jobType !=3 && parseInt($scope.job.experienceMin) > parseInt($scope.job.experienceMax)){
      $scope.errorMessage = "Max experience should be greater than or equal to min experience.";
      $scope.error=true;
      messageFactory.setError(true);
      return false;
    }

    //Validate internship dates
    if($scope.job.jobType ==3){
      logger.info("inside jobType validation");
      var d = new Date();
      var n = d.getFullYear();
      var m = d.getMonth();

      /*if($scope.job.startYear < n || $scope.months.indexOf($scope.job.startMonth) < m){*/
      if($scope.job.startYear < n){
        $scope.errorMessage = "Start Date should be greater than or equal to current date.";
        $scope.error=true;
        messageFactory.setError(true);
        logger.info( $scope.errorMessage );
        return false;
      }
      if($scope.job.startYear == n && $scope.months.indexOf($scope.job.startMonth) < m){
        $scope.errorMessage = "Start Date should be greater than or equal to current date.";
        $scope.error=true;
        messageFactory.setError(true);
        logger.info( $scope.errorMessage );
        return false;
      }
      if($scope.job.endYear == n && $scope.months.indexOf($scope.job.endMonth) < m){
        $scope.errorMessage = "End Date should be greater than or equal to current date.";
        $scope.error=true;
        messageFactory.setError(true);
        logger.info( $scope.errorMessage );
        return false;
      }
      if($scope.job.startYear == n && $scope.months.indexOf($scope.job.startMonth) < m){
        $scope.errorMessage = "Start Date should be greater than or equal to current date.";
        $scope.error=true;
        messageFactory.setError(true);
        logger.info( $scope.errorMessage );
        return false;
      }
      if($scope.job.startYear > $scope.job.endYear){
        $scope.errorMessage = "Start Date should be less than end date";
        $scope.error=true;
        messageFactory.setError(true);
        logger.info( $scope.errorMessage );
        return false;
      }

      if($scope.job.startYear == $scope.job.endYear){
        if($scope.months.indexOf($scope.job.startMonth) > $scope.months.indexOf($scope.job.endMonth)){
          $scope.errorMessage = "Dates are invalid";
          $scope.error=true;
          messageFactory.setError(true);
          logger.info( $scope.errorMessage );
          return false;
        }

      }


    }

    $scope.showPostjobFrom = false;
    $scope.job.status=1;
      logger.info("--savePostJob--called");
    $scope.job.oldlocation= $scope.job.location;

		$scope.job.location={
				"locationId": $scope.job.location
		};
    $scope.job.oldjobType = $scope.job.jobType;

		$scope.job.jobType={
				"jobTypeId": $scope.job.jobType
		};

    $scope.job.oldJobFunction=$scope.job.jobFunction;
		$scope.job.jobFunction=[$scope.job.jobFunction];
		logger.info("job jobFunction : "+$scope.job.jobFunction);

    $scope.job.skills = [];
			for(var i=0;i< $scope.tags.length;i++){
			    $scope.job.skills.push($scope.tags[i]);
			}
		logger.info("job skills : "+$scope.job.skills);

		if ($scope.job.hasOwnProperty("userId")) {
			 delete $scope.job["userId"];
		}

    if (!$scope.job.hasOwnProperty("experienceMin")) {
      $scope.job.experienceMin=0;
    }
    if (!$scope.job.hasOwnProperty("experienceMax")) {
      $scope.job.experienceMax=0;
    }
    $scope.userdata = JSON.parse(localStorage.getItem("userData"));
    if($scope.job.jobType.jobTypeId == 3){
      $scope.job.startDate = $scope.job.startMonth +" "+ $scope.job.startYear;
      $scope.job.endDate = $scope.job.endMonth +" "+ $scope.job.endYear;
    }

    logger.info("unpiad data :"+ $scope.job.unpaid);
    logger.info("hideSalary data :"+ $scope.job.hideSalary);

    if($scope.job.unpaid){
      $scope.job.salaryMin=0;
      $scope.job.salaryMax=0;
      $scope.job.hideSalary=0;
    }

    if($scope.job.hideSalary) {
      $scope.job.hideSalary = 1;
    }
    else {
      $scope.job.hideSalary = 0;
    }

    var url = baseUrl + '/api/user/'+$scope.userdata.userId+'/postjob';
    showSavingJobAnimate();

    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.job)).then(
					function (response) {
						if (response.status === 'success' )
            {
						  $scope.userdata = response.data;

              if(!($location.path() == '/editPostjob')) {
                $scope.nav.navBar = true;
                logger.info("Navigating to jobsuccess" + $location.path());
                messageFactory.setError(false);
                $location.path( 'jobs' );
              } else {
                showSavedJobAnimate();

                $scope.job.jobType = $scope.job.oldjobType;
                $scope.job.location= $scope.job.oldlocation;
                $scope.job.jobFunction=$scope.job.oldJobFunction;
                $scope.showPostjobFrom = true;

                logger.info("Navigating to jobs" + $location.path());
                // messageFactory.setError(false);
                // $location.path( 'jobs' );
              }
						}
						else {
              $scope.job.jobType = $scope.job.oldjobType;
              $scope.job.location= $scope.job.oldlocation;
              $scope.job.jobFunction=$scope.job.oldJobFunction;
							$scope.errorMessage = response.msg.description;
              $scope.error=true;
              messageFactory.setError(true);
              $scope.showPostjobFrom = true;
						}
					}, function (error) {
					  $scope.job.jobType = $scope.job.oldjobType;
            $scope.job.location= $scope.job.oldlocation;
            $scope.job.jobFunction=$scope.job.oldJobFunction;
            $scope.errorMessage = "Something wrong with the action. Please try again";
            $scope.error=true;
            messageFactory.setError(true);
            $scope.showPostjobFrom = true;
					});
	};

  $scope.closeJob = function() {
    $location.path( 'jobs' );
  }

  $scope.loadPendingJobs = function(){
	  $scope.userJobData = workruitService.userJobs;
  }

 $scope.loadSkillsByJobFunction = function(){
   logger.info("job function selected -----------");
   logger.info($scope.job.jobFunction);
   var param = {};
   param["page"] =0;
   param["size"] =30;
   param["skillName"] ="";

   $scope.masterJobFunctionSkills = [];
   $scope.jobFunctionSkills = [];

   var url = baseUrl + 'api/skills?page=0&size=30&skillName=&jobFunction='+$scope.job.jobFunction;

   HttpClientHelper.ExecuteGetMethod(url).then(function(response) {
       logger.info(response);
       var skills = response.content;
       for(var i=0;i<skills.length;i++){
         //var skill =[];
         //skill.push();
         $scope.masterJobFunctionSkills.push(skills[i].skillName);
         if(!containsObject(skills[i].skillName,$scope.tags)){
           $scope.jobFunctionSkills.push(skills[i].skillName);
         }
       }
   });
 }


 $scope.validateFormData = function() {
   logger.info(JSON.stringify($scope.jobpostform));
   return false;
 }


$scope.loadAllJobs = function(){
	//alert("loadAllJobs -- 53 -- is it wrking?");
	$scope.userJobData = workruitService.userJobs;
}

if(($location.path()=='/editPostjob' || $location.path()=='/closePostjob') && localStorage.getItem("editJobId") !== undefined) {

  var url = baseUrl + '/api/job/'+localStorage.getItem("editJobId")+'/getJobInfo';
  HttpClientHelper.ExecuteGetMethod(url).then(function successCallback(response) {
    var jobsData = {};
    var jobsResponse = response.data;
    jobsData.jobFunction = ""+jobsResponse.jobFunction[0];
    jobsData.location = ""+jobsResponse.location.locationId;
    jobsData.jobType=""+jobsResponse.jobType.jobTypeId;
    jobsData.experienceMax = ""+jobsResponse.experienceMax;
    jobsData.experienceMin = ""+jobsResponse.experienceMin;
    jobsData.hideSalary = jobsResponse.hideSalary;
    jobsData.title = ""+jobsResponse.title;
    jobsData.description = ""+jobsResponse.description;
    jobsData.salaryMax = ""+jobsResponse.salaryMax;
    jobsData.salaryMin = ""+jobsResponse.salaryMin;
    jobsData.jobPostId = ""+jobsResponse.jobPostId;
    jobsData.status = ""+jobsResponse.status;
    jobsData.unpaid = jobsResponse.unpaid;
    logger.info(jobsResponse.startDate);
    var startDateMonth = $filter('split')(jobsResponse.startDate,' ',0);
    var startDateYear = $filter('split')(jobsResponse.startDate,' ',1);

    var endDateMonth = $filter('split')(jobsResponse.endDate,' ',0);
    var endDateYear = $filter('split')(jobsResponse.endDate,' ',1);

    jobsData.startMonth= $scope.months[$scope.months.indexOf(startDateMonth)];
    jobsData.startYear= $scope.years[$scope.years.indexOf(startDateYear)];
    jobsData.endMonth= $scope.months[$scope.months.indexOf(endDateMonth)];
    jobsData.endYear= $scope.years[$scope.years.indexOf(endDateYear)];

    $scope.salSlider.min= jobsData.salaryMin;
    $scope.salSlider.max =jobsData.salaryMax;
    $scope.expSlider.min=jobsData.experienceMin;
    $scope.expSlider.max= jobsData.experienceMax;



    var originalSkills = jobsResponse.skills;
    $scope.job = filterJob(jobsData);

    $scope.loadSkillsByJobFunction();
    for(var i=0;i<originalSkills.length;i++){

      //var skill = [];
      //skill.push();

      $scope.tags.push(originalSkills[i]);
      removeObject(originalSkills[i],$scope.jobFunctionSkills);
    }

  });

function filterJob(jobsData) {
  if(jobsData["hideSalary"] == 1) {
    jobsData["hideSalary"] = true;
  }
  else {
    jobsData["hideSalary"] = false;
  }
  console.log("jobsData: ", jobsData);
  return jobsData;
}


}

}]);
