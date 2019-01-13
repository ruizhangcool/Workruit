var workruitApp = angular.module('workruitUiApp');
workruitApp.factory('workruitService', ['$http', '$q','$crypto','logger', function($http, $q,$crypto,logger){

	var instance = {};
	instance.userdata = {};
	instance.userJobs = {};
	instance.activeTab="";
	instance.uploadedPicPath = "";
	instance.userEditJobs = {};
	instance.candidateProfile = {};
	instance.isFromEditPost = false;
	instance.userCreds = {};
  instance.email = "";

	instance.validateLogin = function(email, passwd) {
		var deferred = $q.defer();

    var fcmToken = localStorage.getItem("fcm_token");
		var jsonReq = {};
		jsonReq.username=email;
		jsonReq.password=passwd;
		jsonReq.role="recruiter";
    jsonReq.regdId = (fcmToken == null ) ? "NA" : fcmToken;
    logger.info(JSON.stringify(jsonReq));
    var encrypted = $crypto.encrypt(JSON.stringify(jsonReq));
    logger.info(encrypted);
		$http({
			  method: 'POST',
        headers: {
          'Token': localStorage.getItem("sessionId"),
          'Content-Type' :'text/plain;charset=UTF-8'
         },
			  url: baseUrl + 'api/dashboardLogin',
			  cache: false,
         transformResponse: undefined,
			  data: encrypted
			}).success(function successCallback(response) {
         logger.info(response);
        var decrypted = $crypto.decrypt(response);
        logger.info(decrypted);
				deferred.resolve(JSON.parse(decrypted));
				instance.userdata = JSON.parse(decrypted).data;
				//we need only userdata in response
				logger.info("instance.userdata.userId : "+instance.userdata.userId);
				logger.info("instance.userdata.company about "+instance.userdata.company.about);
				//deferred.resolve(response);
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.viewPostedJobsByRecruiter = function(userId) {
		var deferred = $q.defer();
		logger.info("43 - service.js - viewPostedJobsByRecruiter : "+userId);
		$http({
			method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + 'api/user/'+userId+'/viewPostedJobs'
			}).success(function successCallback(response) {
				//deferred.resolve(response);
				//instance.userJobs = response.data;
				instance.userJobs = response;
				logger.info("50  - service.js -  instance.userJobs  Array Length : "+instance.userJobs.data.length);
				deferred.resolve(response);
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.getMatchedProfiles = function(jobPostId) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/job/'+jobPostId+'/profiles'
			}).success(function successCallback(response) {
				deferred.resolve(response);
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.postJob = function(jobPostObj, userId) {
		var deferred = $q.defer();
    if(jobPostObj.jobType.jobTypeId == 3){
      jobPostObj.startDate = jobPostObj.startMonth +" "+ jobPostObj.startYear;
      jobPostObj.endDate = jobPostObj.endMonth +" "+ jobPostObj.endYear;
    }

    logger.info("unpiad data :"+jobPostObj.unpaid);
    if(jobPostObj.unpaid){
      jobPostObj.salaryMin=0;
      jobPostObj.salaryMax=0;
      jobPostObj.hideSalary=0;
    }

		$http({
			method: 'POST',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/user/'+userId+'/postjob',
			data:jobPostObj
			}).success(function successCallback(response) {
				deferred.resolve(response);
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}



  instance.saveProfileStatusForJob = function(jobPostId, userId, statusValue) {
		var deferred = $q.defer();
		var req = {};
		req.recruiterProfileAction = statusValue;

		$http({
			method: 'POST',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/job/'+jobPostId+'/user/'+userId,
			data:req
			}).success(function successCallback(response) {
				deferred.resolve(response);
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.saveProfileStatusForJobForPreference = function(jobPostId, userId, statusValue) {
		var deferred = $q.defer();
		var req = {};
		req.recruiterProfileAction = statusValue;

		$http({
			method: 'POST',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/likeProfileActionInPreferences/job/'+jobPostId+'/user/'+userId,
			data:req
			}).success(function successCallback(response) {

				deferred.resolve(response);
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	/*
	instance.viewShortListedProfilesForJobs = function(jobList) {
		var deferred = $q.defer();
		$http({
			method: 'POST',
			url: baseUrl + '/api/job/viewShortListedProfilesForJobs',
			data:jobList
			}).success(function successCallback(response) {
				deferred.resolve(response);
				//instance.userJobs = response.data;
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}*/

	instance.viewShortListedProfilesForJobs = function(userId) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/user/'+userId+'/viewLikedProfiles'
			}).success(function successCallback(response) {
				deferred.resolve(response);
				//instance.userJobs = response.data;
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	//new service written by srinivas
	instance.getLoginCredentials = function(userId) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/user/'+userId+'/getLoginCredentials'
			}).success(function successCallback(response) {
				deferred.resolve(response);
				instance.userCreds = response;
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.recruiterApplicantMatchesForJobs = function(userId) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/user/'+userId+'/recruiterApplicantMatches'
			}).success(function successCallback(response) {
				deferred.resolve(response);
				//instance.recruiterMatches = response.data;
				instance.recruiterMatches = response;
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.recruiterInterestedProfilesForJobs = function(userId) {
		var deferred = $q.defer();
		$http({
			method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + 'api/user/'+userId+'/recruiterInterestedProfiles'
			}).success(function successCallback(response) {
				deferred.resolve(response);
				//instance.recruiterMatches = response.data;
				instance.recruiterInterestedProfiles = response;
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.getProfilesOnCriteriaChange = function(jobPostId,experienceMin,experienceMax,jobTypeId) {

		var deferred = $q.defer();

		var jsonReq = {};
		jsonReq.jobPostId=parseInt(jobPostId);
		jsonReq.experienceMin=experienceMin;
		jsonReq.experienceMax=experienceMax;
		jsonReq.jobType = {};
    jsonReq.jobType.jobTypeId= jobTypeId.jobTypeId;
    logger.info(jsonReq);

		$http({
			method: 'POST',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + 'api/job/'+jobPostId+'/recruiterPreferences',
			data: jsonReq
			}).success(function successCallback(response) {
      logger.info("JSON Stringify:"+JSON.stringify(response));
				deferred.resolve(response);

				//instance.recruiterMatches = response.data;
				instance.profilesOnCriteriaChange = response;
      logger.info("SUCCESS");
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	instance.getJobPostInformation = function(jobPostId) {

		var deferred = $q.defer();

		$http({
			method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
			url: baseUrl + '/api/job/'+jobPostId+'/getJobInfo',
			cache: false
		}).success(function successCallback(response) {
				deferred.resolve(response);
				//instance.recruiterMatches = response.data;
				instance.jobPostInfo = response;
				logger.info("jobPostInfo SUCCESS");
			}).error(function errorCallback(response) {
				deferred.reject(response);
			});
		 return deferred.promise;
	}

	return instance;

}]);
