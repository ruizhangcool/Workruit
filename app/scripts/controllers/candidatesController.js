/**
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('candidatesController', ['$scope', '$location','$rootScope',
  'messageFactory','toaster','$timeout','logger','HttpClientHelper','$http','ngToast',
  function($scope, $location,$rootScope,messageFactory,toaster,$timeout,logger,HttpClientHelper,$http,ngToast) {

  $scope.candidateArray = [];
  $scope.cand_index = 0;
  $scope.jobsearch = {};
  $scope.jobsearch.jobid = "";
  $scope.jobsearch.expMin = "";
  $scope.jobsearch.expMax = "";
  $scope.jobsearch.locId = "";
  $scope.jobsearch.jobTypeId = "";
  $scope.jobsearch.searchType = false;
  $scope.JobsData = [];
  $scope.experienceConstant=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  $scope.candidate={};
  $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
  $scope.limit=false;
  $scope.message=2;
  $scope.success=false;
  $scope.error=false;
  $scope.showVariable=false;
  $scope.prefbox=false;
  $scope.slider = {
    min: 0,
    max: 20,
    options: {
      floor: 0,
      ceil: 20,
      step: 1,
      precision: 1,
      enforceStep: false,
       // translate: function (value) {
       //           return  value + '.0';
       // }
   }
  };

  $scope.criteriaChange = false;
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

  var STATUS = {
      "NOT_SEEN":0,
      "LIKE":1,
      "DISLIKE":2
  }

  //$scope.nav.activeTab = "candidate";

  $scope.getAllJobs= function() {

    var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/viewPostedJobs';
    HttpClientHelper.ExecuteGetMethod(url).then(
        function (response) {
          if (response.status === 'success' ) {
            $scope.JobsData = response.data;

            if ($scope.JobsData) {
              if ($scope.JobsData.length === 0) {
                //$scope.nav.navBar = true;
                $scope.message=0;
                $scope.prefbox=false;
                return;
              }

              for(var k=0;k<$scope.JobsData.length;k++){
                if($scope.JobsData[k].status !=3){
                  $scope.prefbox=true;

                  loadJobs($scope.JobsData);

                  localStorage.setItem("job",JSON.stringify($scope.JobsData[k]));
                  $scope.jobsearch.jobid = ""+$scope.JobsData[k].jobPostId;

                  //This logic is for setting the JobType DropDown.
                  var j =0;
                  logger.info($scope.masterData.jobTypes);
                  for(var i=0;i<$scope.masterData.jobTypes.length;i++) {
                    if ($scope.JobsData[k].jobType.jobTypeId == $scope.masterData.jobTypes[i].jobTypeId) {
                      j = i;
                      break;
                    }

                  }
                  $scope.jobsearch.jobTypeId = $scope.masterData.jobTypes[j];
                  logger.info("-------"+JSON.stringify($scope.JobsData[k].jobType));

                  $scope.jobsearch.expMin = $scope.experienceConstant[$scope.JobsData[k].experienceMin];

                  $scope.jobsearch.expMax = $scope.experienceConstant[$scope.JobsData[k].experienceMax];

                  $scope.slider.min = $scope.JobsData[k].experienceMin;
                  $scope.slider.max = $scope.JobsData[k].experienceMax;

                  logger.info("Min exp ::"+ $scope.jobsearch.expMin);
                  logger.info("Max exp ::"+ $scope.jobsearch.expMax);

                  var url = baseUrl + '/api/job/'+$scope.JobsData[k].jobPostId+'/profiles';
                  HttpClientHelper.ExecuteGetMethod(url).then(
                    function (response) {
                      $scope.candidateArray = response.data;

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
                  return;
                }
              }

              if(!$scope.prefbox){
                $scope.message=0;
              }


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
          console.error(error);
        });
  };

  $scope.getAllJobs();

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

    var req = {};
    req.recruiterProfileAction = statusValue;

    logger.info(req);

    var url = baseUrl + '/api/job/'+$scope.jobsearch.jobid+'/user/'+candidate.userId;
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify(req)).then(
        function (response) {
          logger.info("success");
          if(statusValue == 1){

            /*$timeout(function () {
               toaster.pop({ type: 'info', body: 'Profile liked successfully.' });
             }, 3000);*/
            createNotify("New Match", "Profile liked successfully.");
            /*
            ngToast.create({
                className: 'success',
                content: 'Profile liked successfully',
                dismissButton: true,
                dismissOnTimeout: true
              });
              */
            }else{
             /* $timeout(function () {
                toaster.pop({ type: 'info', body: 'Profile passed.' });
              }, 3000);*/

            createNotify("New Match", "Profile passed.");
            /*
            ngToast.create({
                className: 'success',
                content: 'Profile passed.',
                dismissButton: true,
                dismissOnTimeout: true
              });
              */
            }


          if($scope.criteriaChange ){

            var jsonReq = {};
            jsonReq.jobPostId=parseInt($scope.jobsearch.jobid);
            jsonReq.experienceMin=$scope.slider.min;
            jsonReq.experienceMax=$scope.slider.max;
            jsonReq.jobType = {};
            jsonReq.jobType.jobTypeId= $scope.jobsearch.jobTypeId.jobTypeId;
            logger.info(jsonReq);

            var url = baseUrl + 'api/job/'+$scope.jobsearch.jobid+'/recruiterPreferences';
            HttpClientHelper.ExecutePostMethod(url,JSON.stringify(jsonReq)).then(
              function (response) {
                logger.info("Data :"+JSON.stringify(response));
                $scope.candidateArray = response.data;
                logger.info("getProfilesOnCriteriaChange : response length : "+response.data.length);
                if ($scope.candidateArray && $scope.candidateArray.length > 0) {
                  $scope.message=1;
                  $scope.limitDescription="";
                  $scope.limitTitle="";
                  $scope.limit=false;
                  logger.info("_getProfilesOnCriteriaChange : : "+$scope.candidateArray.length);
                  $scope.jobsearch.searchType = true;
                } else {
                  $scope.nav.navBar = true;
                  $scope.message=0;
                  $scope.limitDescription=response.msg;
                  $scope.limitTitle=response.title;
                  $scope.imageLink=response.image_link;
                  $scope.limit=response.limit;
                }

              });
          }else{

            var url = baseUrl + '/api/job/'+$scope.jobsearch.jobid+'/profiles';
            HttpClientHelper.ExecuteGetMethod(url).then(
              function (response) {
                $scope.candidateArray = response.data;
                logger.info(response);
                logger.info("_getMatchedProfiles : response length : "+response.data.length);
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


        },function (error) {
          console.error(error);
          logger.info("ERROR-88");
          logger.info(""+error);
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

    $scope.saveProfileLikeDisLikePreferences = function _saveProfileLikeDisLikePreferences(likeStatus, candidate) {
      //alert($scope.jobsearch.jobid + " :: "+candidate.userId);
      $scope.message=2;
      var statusValue = likeStatus?STATUS.LIKE:STATUS.DISLIKE;
      var req = {};
      req.recruiterProfileAction = statusValue;

      logger.info(req);

      var url = baseUrl + '/api/likeProfileActionInPreferences/job/'+$scope.jobsearch.jobid+'/user/'+candidate.userId;
      HttpClientHelper.ExecutePostMethod(url,JSON.stringify(req)).then(
          function (response) {
            logger.info("success");
            if(statusValue == 1){

              $timeout(function () {
                toaster.pop({ type: 'info', body: 'Profile liked successfully.' });
              }, 3000);
            }else{
              $timeout(function () {
                toaster.pop({ type: 'info', body: 'Profile passed.' });
              }, 3000);
            }
            logger.info("likeProfileActionInPreferences - success");
            var jsonReq = {};
            jsonReq.jobPostId=parseInt($scope.jobsearch.jobid);
            jsonReq.experienceMin=$scope.slider.min;
            jsonReq.experienceMax=$scope.slider.max;
            jsonReq.jobType = {};
            jsonReq.jobType.jobTypeId= $scope.jobsearch.jobTypeId.jobTypeId;
            logger.info(jsonReq);

            var url = baseUrl + 'api/job/'+$scope.jobsearch.jobid+'/recruiterPreferences';
            HttpClientHelper.ExecutePostMethod(url,JSON.stringify(jsonReq)).then(
              function (response) {
                logger.info("Data :"+JSON.stringify(response));
                $scope.candidateArray = response.data;
                logger.info("getProfilesOnCriteriaChange : response length : "+response.data.length);
                if ($scope.candidateArray && $scope.candidateArray.length > 0) {
                  $scope.message=1;
                  $scope.limitDescription="";
                  $scope.limitTitle="";
                  $scope.limit=false;
                  logger.info("_getProfilesOnCriteriaChange : : "+$scope.candidateArray.length);
                  $scope.jobsearch.searchType = true;
                } else {
                  $scope.nav.navBar = true;
                  $scope.message=0;
                  $scope.limitDescription=response.msg;
                  $scope.limitTitle=response.title;
                  $scope.limit=response.limit;
                  $scope.imageLink=response.image_link;
                }

              });
          },function (error) {
            console.error(error);
            logger.info("ERROR-129");
            logger.info(""+error);
          });
    };

    $scope.getNewMatchedProfiles = function() {
      console.log("getNewMatchedProfiles = ", $scope.jobsearch.jobid);
    }

  $scope.getMatchedProfiles  = function _getMatchedProfiles(jobPostId) {

      console.log("jobPostId = ", jobPostId);
    console.log("jobsearch.jobid = ", $scope.jobsearch.jobid);

    var url = baseUrl + '/api/job/'+jobPostId+'/getJobInfo';
    HttpClientHelper.ExecuteGetMethod(url).then(
        function (response) {
          localStorage.setItem("job",JSON.stringify(response.data));
        //$scope.jobsearch.jobid = response.data.jobPostId;
          logger.info(response);
        logger.info("Job Id : "+$scope.jobsearch.jobid );
          logger.info("JOb Search ID ::"+JSON.stringify(response.data));

          $scope.jobsearch.jobid = ""+response.data.jobPostId;

          //This logic is for setting the JobType DropDown.
          var j =0;
          //logger.info(response.data.jobType.jobTypeId);
          var masterJobTypes = $scope.masterData.jobTypes;
          for(var k=1;k<masterJobTypes.length;k++) {
            logger.info($scope.masterData.jobTypes[k].jobTypeId);
            if (response.data.jobType.jobTypeId == $scope.masterData.jobTypes[k].jobTypeId) {
              j = k;
              break;
            }

          }
          $scope.jobsearch.jobTypeId = $scope.masterData.jobTypes[j];

          $scope.jobsearch.expMin = $scope.experienceConstant[response.data.experienceMin];

          $scope.jobsearch.expMax = $scope.experienceConstant[response.data.experienceMax];

          $scope.slider.min = response.data.experienceMin;

          $scope.slider.max = response.data.experienceMax;

          logger.info("Min exp ::"+ $scope.jobsearch.expMin);
          logger.info("Max exp ::"+ $scope.jobsearch.expMax);

        }
    );


    var url = baseUrl + '/api/job/'+jobPostId+'/profiles';
    HttpClientHelper.ExecuteGetMethod(url).then(
        function (response) {
          $scope.candidateArray = response.data;
          logger.info(response);
          logger.info("_getMatchedProfiles : response length : "+response.data.length);
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

  $scope.getProfilesOnCriteriaChange = function getProfilesOnCriteriaChange(jobid,expMin,expMax,locId,jobTypeId,locType){

    logger.info("_getProfilesOnCriteriaChange : candidatesController : ");
    logger.info("_getProfilesOnCriteriaChange : jobPostId : "+$scope.jobsearch.jobid);
    logger.info("_getProfilesOnCriteriaChange : locId : "+$scope.jobsearch.locId);
    logger.info("_getProfilesOnCriteriaChange : expMin : "+$scope.jobsearch.expMin);
    logger.info("_getProfilesOnCriteriaChange : expMax : "+$scope.jobsearch.expMax);
    logger.info("_getProfilesOnCriteriaChange : jobTypeId : "+JSON.stringify($scope.jobsearch.jobTypeId));

    if($scope.jobsearch.expMin > $scope.jobsearch.expMax){
      $scope.errorMessage = "Experience is not valid";
      $scope.error=true;
      messageFactory.setError(true);
      return false;
    }


    //Check criteria change on not.
    var jobInfo = JSON.parse(localStorage.getItem("job"));
    logger.info(jobInfo);
    var jobId = jobInfo.jobPostId;
    var jobTypeObject = jobInfo.jobType;
    var jobTypeIdValue = jobTypeObject.jobTypeId;
    var expMin = $scope.slider.min;

    var expMax = $scope.slider.max;
    logger.info(expMin+"---"+expMax);

    if($scope.jobsearch.jobid == jobId && $scope.jobsearch.expMin == expMin && $scope.jobsearch.expMax==expMax && $scope.jobsearch.jobTypeId.jobTypeId == jobTypeIdValue){
      logger.info("Criteria not changed, so no action");
     // return ;
    }else{
      $scope.criteriaChange = true;
    }
    $scope.message=2;

    var jsonReq = {};
    jsonReq.jobPostId=parseInt($scope.jobsearch.jobid);
    jsonReq.experienceMin=$scope.slider.min;
    jsonReq.experienceMax=$scope.slider.max;
    jsonReq.jobType = {};
    jsonReq.jobType.jobTypeId= $scope.jobsearch.jobTypeId.jobTypeId;
    logger.info(jsonReq);
    var locArr = [];
    if(locType==='Other' && $scope.locations.length > 0){
      angular.forEach($scope.locations, function(value, key) {
        angular.forEach(value, function(v, k) {
        if(k == 'name')
          locArr.push(v);
        });
      });
      jsonReq.location = locArr.toString();
    }
    var url = baseUrl + 'api/job/'+$scope.jobsearch.jobid+'/recruiterPreferences';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify(jsonReq)).then(
        function (response) {
          logger.info("Data :"+JSON.stringify(response));
          $scope.candidateArray = response.data;
          logger.info("_getMatchedProfiles : response length : "+response.data.length);
          if ($scope.candidateArray && $scope.candidateArray.length > 0) {
            $scope.message=1;
            $scope.limitDescription="";
            $scope.limitTitle="";
            $scope.limit=false;
            logger.info("_getProfilesOnCriteriaChange : : "+$scope.candidateArray.length);
            $scope.jobsearch.searchType = true;
          } else {
            $scope.nav.navBar = true;
            $scope.message=0;
            $scope.limitDescription=response.msg;
            $scope.limitTitle=response.title;
            $scope.limit=response.limit;
            $scope.imageLink=response.image_link;
          }

        });
  }

  $scope.loadFullProfile = function _loadFullProfile(profiles) {
    logger.info("loadFullProfile"+JSON.stringify(profiles));
    $rootScope.candidate = profiles;
    $scope.showVariable=true;
    //$location.path('candidateCardProfile');
  }

  $scope.showMainDiv = function(){
    $scope.showVariable=false;
  }


  $scope.resetButtonClick = function _resetButtonClick(){

    $scope.message =2;

    logger.info("RESET BUTTON CLICKED!  : "+$scope.jobsearch.jobid);
    var url = baseUrl + '/api/job/'+$scope.jobsearch.jobid+'/getJobInfo';
    HttpClientHelper.ExecuteGetMethod(url).then(
        function (response) {
        $scope.jobsearch.jobid = ""+response.data.jobPostId;
        logger.info("Job Id : "+$scope.jobsearch.jobid );
        $scope.jobsearch.expMin = response.data.experienceMin;
        logger.info("Job expMin : "+$scope.jobsearch.expMin );
        $scope.jobsearch.expMax = response.data.experienceMax;
        logger.info("Job expMax : "+$scope.jobsearch.expMax );
        $scope.jobsearch.locId = response.data.locationId;
        logger.info("Job locId : "+$scope.jobsearch.locId );
        $scope.jobsearch.jobTypeId = response.data.jobType.jobTypeId;
          logger.info("Job jobType : "+$scope.jobsearch.jobTypeId );
        $scope.jobsearch.searchType = false;


        var j =0;
        logger.info($scope.masterData.jobTypes);
        for(var i=0;i<$scope.masterData.jobTypes.length;i++) {
          if ($scope.jobsearch.jobTypeId == $scope.masterData.jobTypes[i].jobTypeId) {
            j = i;
            break;
          }

        }
        $scope.jobsearch.jobTypeId = $scope.masterData.jobTypes[j];

          var url = baseUrl + 'api/user/'+$scope.jobsearch.jobid+'/profiles';
          HttpClientHelper.ExecuteGetMethod(url).then(
            function (response) {
                $scope.candidateArray = response.data;

              if ($scope.candidateArray && $scope.candidateArray.length > 0) {
                $scope.message = 1;
              } else {
                $scope.nav.navBar = true;
                $scope.message=0;
              }

            },function (error) {
              console.error(error);
            });

        }
    );

    logger.info("RESET BUTTON CLICKED!");

  }

  $http.get('cities.json')
      .success(function(data) {
          $scope.chipSet  = JSON.parse(data);
          initLocationTag($scope.chipSet);
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

}]);
