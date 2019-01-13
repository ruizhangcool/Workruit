var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('candidatesNewController', ['$scope', '$location','$rootScope','messageFactory','toaster','$timeout','logger','HttpClientHelper','$http','ngToast',
  function($scope, $location,$rootScope,messageFactory,toaster,$timeout,logger,HttpClientHelper,$http,ngToast) {
  	 $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
  	 $scope.candidateArray = [];
	 $scope.cand_index = 0;
	 $scope.jobsearch = {};
	 $scope.jobsearch.jobid = "";
	 $scope.jobsearch.expMin = "";
	 $scope.jobsearch.expMax = "";
	 $scope.jobsearch.locId = "";
	 $scope.jobsearch.jobTypeId = "";
	 $scope.jobsearch.searchType = false;
	  $scope.experienceConstant=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
	  $scope.candidate={};
	  $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
	  $scope.limit=false;
	  $scope.message=2;
	  $scope.success=false;
	  $scope.error=false;
	  $scope.showVariable=false;
	  $scope.prefbox=false;
	  $scope.jobTy = {};

   $scope.criteriaChange = false;
   var STATUS = {
			"NOT_SEEN":0,
			"LIKE":1,
			"DISLIKE":2
	}
  	 $scope.slider = {
	    min: 0,
	    max: 20,
	    options: {
	      floor: 0,
	      ceil: 20,
	      step: 0.1,
	      precision: 1,
	      enforceStep: false,
	      step: 1,
	      precision: 1,
	      enforceStep: false,
	      translate: function (value) {
	                return  value + '.0';
	      }
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


	var getProfiles = function(jobPostId){
		var url = baseUrl + '/api/job/'+jobPostId+'/profiles';
		HttpClientHelper.ExecuteGetMethod(url).then(
			function (response) {
				 //$scope.candidate = response.data[0];
				  $scope.candidateArray.push(response.data[0]);
				  if ($scope.candidateArray && $scope.candidateArray.length > 0) {
				        $scope.message=1;
				        $scope.jobsearch.searchType = false;
				        $scope.limitDescription="";
				        $scope.limitTitle="";
				        $scope.limit=false;
				    } else {
				         $scope.nav.navBar = true;
				         $scope.message=0;
				         $scope.limitDescription=response.msg;
				          $scope.limitTitle=response.title;
				         $scope.limit=response.limit;
				         $scope.imageLink=response.image_link;
				    }
 				},function (error) {
				   console.error(error);
			    });
	}
	//getProfiles(783);
	var getActiveJobs = function(){
		var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/viewPostedJobs';
		HttpClientHelper.ExecuteGetMethod(url).then(
				function (response) {
					if (response.status === 'success' ) {
						$scope.JobsData = response.data ;
						if($scope.JobsData){
						if ($scope.JobsData.length === 0) {
			                //$scope.nav.navBar = true;
			                $scope.message=0;
			                $scope.prefbox=false;
			                return;
			            }else if ($scope.JobsData.length > 0){
			            	if($scope.JobsData[0].status !=3){
			            		$scope.prefbox=true;
				                  localStorage.setItem("job",JSON.stringify($scope.JobsData[0]));
				                  $scope.jobsearch.jobid = ""+$scope.JobsData[0].jobPostId;
				                  if($scope.JobsData[0].jobType){
 								  	$scope.jobTy.jobTypeId = $scope.JobsData[0].jobType.jobTypeId;
 								  	$scope.jobTy.jobTypeTitle = $scope.JobsData[0].jobType.jobTypeTitle;
 								  	$scope.jobsearch.jobTypeId = $scope.JobsData[0].jobType.jobTypeId;
 								  }
 								  $scope.jobsearch.expMin = $scope.experienceConstant[$scope.JobsData[0].experienceMin];
				                  $scope.jobsearch.expMax = $scope.experienceConstant[$scope.JobsData[0].experienceMax];

				                  $scope.slider.min = $scope.JobsData[0].experienceMin;
				                  $scope.slider.max = $scope.JobsData[0].experienceMax;

				                  getProfiles($scope.JobsData[0].jobPostId);
			            	}
			            }
			            if(!$scope.prefbox){
				           $scope.message=0;
				        }
					  }else{
					    	$scope.nav.navBar = true;
								$scope.message=0;
					  }
					}else {
						$scope.errorMessage = response.msg;
	            		$scope.error=true;
	            		messageFactory.setError(true);
					}
				}, function (error) {
					console.error(error);
				});
	}
	getActiveJobs();

	$http.get('cities.json')
	      .success(function(data) {
	          try{
	            $scope.chipSet  = JSON.parse(data);
	          }catch(e){
	            $scope.chipSet  = data;
	          }
	        })
	       .error(function() {
	           console.error('could not find cities.json');
	        });
	  /*md-chipset code*/
	    $scope.locations = [];
	    $scope.selectedItem = null;
	    $scope.searchText = null;

	    $scope.chipSearch = function(text) {
	      return $scope.chipSet.filter(function(object) {
	        if (angular.isString(angular.lowercase(text))) {
	          return angular.lowercase(object.name).search(text) > -1;
	        } else {
	          return false;
	        }
	      });
	    };

	    $scope.transformChip = function(chip) {
	      return chip;
	    };
	  /*md-chipset code*/

	 $scope.next = function(isJobLike) {

      //Like case
      if(isJobLike) {

          if($scope.criteriaChange ){
           $scope.move(isJobLike);
          }else{
            $scope.saveProfileLikeDisLike(isJobLike, $scope.candidateArray[$scope.cand_index]);
          }

          $scope.candidateArray.splice($scope.cand_index, 1);
          logger.info($scope.cand_index );
          if ($scope.candidateArray.length === 0) {
           // $scope.message = "No Profiles available or you have reached your daily limit, Please visit tomorrow.";
            return;
          }

          if ($scope.cand_index >= $scope.candidateArray.length - 1) {
            $scope.cand_index = 0;
          }
          else {
            $scope.cand_index++;
          }
      }

      //dislike case
      if(!isJobLike){
        var r = confirm("Do you want to dislike the applicant");
        if (r == true) {
          if($scope.criteriaChange ){
            $scope.move(isJobLike);
          }else{
            $scope.saveProfileLikeDisLike(isJobLike, $scope.candidateArray[$scope.cand_index]);
          }
          $scope.candidateArray.splice($scope.cand_index, 1);

          if ($scope.candidateArray.length === 0) {
            //$scope.message = "No Profiles available or you have reached your daily limit, Please visit tomorrow.";
            return;
          }

          if ($scope.cand_index >= $scope.candidateArray.length - 1) {
            $scope.cand_index = 0;
          }
          else {
            $scope.cand_index++;
          }
        }else{
          return;
        }
      }
    };

 $scope.saveProfileLikeDisLike = function _saveProfileLikeDisLike(likeStatus, candidate) {
    var statusValue = likeStatus?STATUS.LIKE:STATUS.DISLIKE;
    $scope.message=2;
    workruitService.saveProfileStatusForJob($scope.jobsearch.jobid, candidate.userId, statusValue).then(
        function (response) {
          logger.info("success");
          if(statusValue == 1){
            createNotify("New Match", "Profile passed.");
            /*
            ngToast.create({
              className: 'success',
              content: 'Profile liked successfully.',
              dismissButton: true
            });
            */

          }else{
            createNotify("New Match", "Profile passed.");

            /*
            ngToast.create({
              className: 'success',
              content: 'Profile passed.',
              dismissButton: true
            });
            */
          }
          if($scope.criteriaChange ){
            workruitService.getProfilesOnCriteriaChange($scope.jobsearch.jobid,$scope.jobsearch.expMin,$scope.jobsearch.expMax,$scope.jobsearch.jobTypeId).then(
              function (response) {
                console.log("Data :"+JSON.stringify(response));
                $scope.candidateArray = response.data;
                console.log("getProfilesOnCriteriaChange : response length : "+response.data.length);
                if ($scope.candidateArray && $scope.candidateArray.length > 0) {
                  $scope.message=1;
                  $scope.limitDescription="";
                  $scope.limitTitle="";
                  $scope.limit=false;
                  console.log("_getProfilesOnCriteriaChange : : "+$scope.candidateArray.length);
                  $scope.jobsearch.searchType = true;
                } else {
                  $scope.nav.navBar = true;
                  $scope.message=0;
                  $scope.limitDescription=response.msg;
                  $scope.limitTitle=response.title;
                  $scope.limit=response.limit;
                }

              });
          }else{
            workruitService.getMatchedProfiles($scope.jobsearch.jobid).then(
              function (response) {
                $scope.candidateArray = response.data;
                console.log(response);
                console.log("_getMatchedProfiles : response length : "+response.data.length);
                if ($scope.candidateArray && $scope.candidateArray.length > 0) {

                  $scope.message=1;
                  $scope.jobsearch.searchType = false;
                  $scope.limitDescription="";
                  $scope.limitTitle="";
                  $scope.limit=false;

                } else {
                  $scope.nav.navBar = true;
                  $scope.message=0;
                  $scope.limitDescription=response.msg;
                  $scope.limitTitle=response.title;
                  $scope.limit=response.limit;
                }
              },function (error) {
                console.error(error);
              });
          }
        },function (error) {
          console.error(error);
          console.log("ERROR-88");
          console.log(""+error);
        });
  }

    $scope.move = function(isJobLike) {
      $scope.message=2;

        $scope.saveProfileLikeDisLikePreferences(isJobLike, $scope.candidateArray[$scope.cand_index]);
          $scope.candidateArray.splice($scope.cand_index, 1);

        if ($scope.candidateArray.length === 0)
        {
          return;
        }
      };


}]);
