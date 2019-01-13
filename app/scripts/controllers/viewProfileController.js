/**
 * @name: Mahesh
 * @company: Workruit
 *
 * performs the signup for the recruiters
 *
 */

var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('viewProfileController', ['$scope', '$routeParams', '$http', '$location', 'workruitService','logger','HttpClientHelper',
                                            function($scope, $routeParams, $http, $location, workruitService,logger,HttpClientHelper) {
  var userData = localStorage.getItem("userData");
  $scope.tabIndex = $routeParams.tabIndex;

  logger.info("Company: ", $scope.company);
  $scope.masterData=JSON.parse(localStorage.getItem("masterData"));
  $scope.jobName = "";

  // Init User Data.
  userData = userData.replace(/firstName/g, 'firstname');
  userData = userData.replace(/lastName/g, 'lastname');
  userData = userData.replace(/phoneNumber/g, 'telephone');
  userData = userData.replace(/companyName/g, 'recruiterCompanyName');
  userData = userData.replace(/recruiterRole/g, 'jobRoleId');
  localStorage.setItem("userData",userData);

  $scope.userdata =  JSON.parse(userData);
  $scope.viewProfile = $scope.userdata;

  var jobRoleId = $scope.userdata.jobRoleId;
  $scope.jobName = filterJob(jobRoleId);
  $scope.selectedUserJobRole = {};

  getUserData();

  // Get My Profile Data.
  function getUserData() {
    var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/getRecruiterProfile';
    HttpClientHelper.ExecuteGetMethod(url).then(function successCallback(response) {
      logger.info("Get My Profile Resonse: ", response.data);

      //setting cache data
      var userDataLocal= JSON.stringify(response.data);
      userDataLocal = userDataLocal.replace(/firstName/g, 'firstname');
      userDataLocal = userDataLocal.replace(/lastName/g, 'lastname');
      userDataLocal = userDataLocal.replace(/phoneNumber/g, 'telephone');
      userDataLocal = userDataLocal.replace(/companyName/g, 'recruiterCompanyName');
      userDataLocal = userDataLocal.replace(/recruiterRole/g, 'jobRoleId');
      userDataLocal = userDataLocal.replace(/recruiterId/g, 'userId');

      $scope.userdata =  JSON.parse(userDataLocal);
      $scope.viewProfile = JSON.parse(userDataLocal);
      $scope.userdata.company = $scope.company;
      $scope.userdata.company.companyName=response.data.companyName;
      $scope.userdata.recruiterCompanyName=response.data.companyName;
      localStorage.setItem("userData",JSON.stringify($scope.userdata) );

      var jobRoleName = filterJob($scope.viewProfile.jobRoleId);
      $scope.jobName = jobRoleName;
    });
  }

  $scope.saveMyProfile = function(formValid) {
    if(!formValid) return;

    if($scope.viewProfile.jobRoleName=="Founder"){
      $scope.viewProfile.jobRoleId=2;
    }
    else if ($scope.viewProfile.jobRoleName=="Human Resources"){
      $scope.viewProfile.jobRoleId=1;
    }else if ($scope.viewProfile.jobRoleName=="Employee"){
      $scope.viewProfile.jobRoleId=3;
    }

    logger.info("Updated Profile: ", $scope.viewProfile);

    showSavingProfileAnimate();
    var url =  baseUrl + '/api/user/'+$scope.viewProfile.userId+'/updateRecruiterProfile';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.viewProfile)).then(function successCallback(response) {
      logger.info("Update Profile Response = ", response);

      if (response.status === 'success' )
      {
        saveMyProfileToLocal($scope.viewProfile);
        showSaveMyProfileAnimate();
      }
      else
      {
        showErrorMessageForMyProfile(response.msg.description);
        // $scope.errorMessage = response.msg.description;
        // $scope.error=true;
        // messageFactory.setError(true);
      }
    });
  }

  function saveMyProfileToLocal(profile) {
    profile.company = $scope.company;
    var userdata =  JSON.stringify(profile);
    localStorage.setItem("userData", userdata);
  }

  // Reset Password.
  $scope.resetPasswordData = {};
  $scope.resetPasswordSubmitted = false;

  $scope.resetPassword = function(formValid) {
    $scope.resetPasswordSubmitted = true;
    if(!formValid) return;

    showSavingChangePasswordAnimate();

    var url = baseUrl + '/api/user/'+$scope.userdata.userId+'/updateUserPassword';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.resetPasswordData)).then(function successCallback(response) {
      if (response.status === 'success' ) {
        // $scope.successMessage = response.msg.description;
        // $scope.success=true;
        // messageFactory.setSuccess(true);
        showChangedPasswordAnimate();
      } else {
        showErrorMessageForChangePassword(response.msg.description);
        // $scope.errorMessage = response.msg.description;
        // $scope.error=true;
        // messageFactory.setError(true);
      }
    });
  };

  // ===============================================================================================
  // ====================================== Company Profile ========================================
  // ===============================================================================================

  // Init Company Data.
  $scope.company = JSON.parse(userData).company;
  $scope.companyList = [];

  // Company Name.
  var companyMasterData = $scope.masterData.companyNameId;
  for (var i =0; i< companyMasterData.length;i++ ){
    $scope.companyList.push(companyMasterData[i].masterCompanyName);
  }

  logger.info("companyList = ", $scope.companyList);
  $scope.myImage='';
  $scope.myCroppedImage='';
  $scope.foundError = false;

  initIndustry();
  initFoundedDate();
  initSocialLinks();
  initCompanyPicture();


  // Init for Image Selection.
  var handleFileSelect = function(evt) {
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.myImage=evt.target.result;
      });
    };
    reader.readAsDataURL(file);
  };

  angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

  // Get Company Data.
  var companyId = $scope.company.companyId;

  $scope.validateFormData = function() {
    //$scope.user
    angular.forEach($scope.myCompanyForm.$error.required, function(field) {
      field.$setDirty();
    });
    if($scope.myCompanyForm.$valid) {
      return true;
    }
    return false;
  };

  function initIndustry() {
    var masterData = localStorage.getItem("masterData");
    masterData = masterData.replace(/industryId/g, 'id');
    masterData = masterData.replace(/industryName/g, 'label');
    var masterDataCompany =JSON.parse(masterData);

    $scope.industrylist = masterDataCompany.industries;
    $scope.industry=[];
    $scope.industryDropDownSettings = { selectionLimit: 3,scrollableHeight: '200px', scrollable: true};

    var array_industry = [];
    for(var i = 0; i < $scope.company.companyIndustriesSet.length; i++) {
      var item = $scope.company.companyIndustriesSet[i];
      var id = item["industry"]["industryId"];
      var label = item["industry"]["industryName"];
      var object = {"id": id, "label": label};
      array_industry[i] = object;
    }

    $scope.industry = array_industry;
    initIndustryField($scope.industrylist, $scope.company.companyIndustriesSet);
  }

  $scope.changedIndustryTags = function(tags) {
    var array_tags = tags.split(",");
    var selectedItems = [];
    for(var i = 0; i < array_tags.length; i++) {
      var tag = array_tags[i];

      for(var j = 0; j < $scope.industrylist.length; j++) {
        var item = $scope.industrylist[j];
        if(tag == item["label"]) {
          selectedItems[i] = item;
          break;
        }
      }
    }

    $scope.industry = selectedItems;
    logger.info("scope.industry: ", $scope.industry);
  }

  function initFoundedDate() {

    $scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    $scope.years = [];

    var year = new Date().getFullYear();
    $scope.years .push(year.toString());
    for (var i = 1; i < (year - 1974); i++) {
      $scope.years .push((year - i).toString());
    }
    $scope.years.push("Before 1975");

    var establishedDate = $scope.company.establishedDate;
    if(establishedDate != null && establishedDate.length > 0) {
      var array = establishedDate.split(' ');
      if(array != null && array.length > 0) {
        $scope.company.establishedMon = array[0];
      }
      if(array != null && array.length > 1) {
        $scope.company.establishedYear = array[1];
      }
    }
  }

  function initSocialLinks() {
    var companySocialMediaLinks = $scope.company.companySocialMediaLinks;
    for(var i = 0; i < companySocialMediaLinks.length; i++) {
      var item = companySocialMediaLinks[i];
      if(item["socialMediaName"] == "Facebook") {
        $scope.company.facebook = item["socialMediaValue"];
      }
      else if(item["socialMediaName"] == "LinkedIn") {
        $scope.company.linkedIn = item["socialMediaValue"];
      }
      else if(item["socialMediaName"] == "Twitter") {
        $scope.company.twitter = item["socialMediaValue"];
      }
    }
  }

  function initCompanyPicture() {
    $scope.companyPicture='';
    $scope.myCroppedImage='';
    $scope.companyPicture = $scope.imageUrl + $scope.company.picture;
  }

  function filterJob(jobRoleId) {
    if(jobRoleId == 1){
      return "Human Resources";
    }
    else if(jobRoleId == 2) {
      return "Founder";
    }else if(jobRoleId == 3){
      return "Employee";
    }
  }

  $scope.aliasUploadFile = function(){
      $scope.company.picture=$scope.myCroppedImage;
      $scope.companyPicture = $scope.myCroppedImage;
      $scope.companyImagesave = true;

      showSaveCompanyBox();
  }

  // Save Company Profile.
  $scope.saveCompany = function() {

    var d = new Date();
    var n = d.getFullYear();
    var m = d.getMonth();

    if($scope.company.establishedYear > n || ($scope.company.establishedYear == n && $scope.months.indexOf($scope.company.establishedMon) > m)){
      $scope.foundError = true;
      return false;
    }
    else {
      $scope.foundError = false;
    }

    var location={};
    var size={};
    var locationList = $scope.masterData.locations;
    var loc ;
    for(var i = 0; i < locationList.length; i++){
      // logger.info(locationList[i].title+"--"+$scope.company.location.title);
      if(locationList[i].title === $scope.company.location.title){
        loc=locationList[i];
        break;
      }
    }

    logger.info("Selected Location: ", loc);
    $scope.company.location = loc;

    var sizeList = $scope.masterData.companySizes;

    var s ;
    for(var i = 0; i < sizeList.length; i++){
      logger.info(sizeList[i].csTitle+"--"+$scope.company.size.csTitle);
      if(sizeList[i].csTitle === $scope.company.size.csTitle){
        s=sizeList[i];
        break;
      }
    }
    logger.info("Selected Size: ", s);
    $scope.company.size = s;


    // do Validation and return
    logger.info("saveCompany Called! - in EDIT Mode");
    if (!$scope.validateFormData()) {
      logger.info($scope.validateFormData());
      // $scope.errorMessage = "Required fields missing";
      // $scope.error=true;
      // messageFactory.setError(true);
      return;
    }

    var industryArray = $scope.industry;
    logger.info("---------------------------------------------------------");
    logger.info("industryArray:", JSON.stringify(industryArray));
    $scope.company.editCompanyIndustriesSet = [];
    for(var i =0 ; i < industryArray.length; i++){
      var industry={};
      var industryIdMap={};
      industryIdMap["industryId"] = industryArray[i].id;
      var industry2 = $scope.industrylist.filter(function(ind) {
        return ind.id == industryArray[i].id;
      });

      logger.info("industry2 = ", JSON.stringify(industry2));
      industryIdMap["industryName"] = industry2[0].label;
      industry["industry"] = industryIdMap;
      $scope.company.editCompanyIndustriesSet.push(industry);
    }

    $scope.company.companyIndustriesSet = $scope.company.editCompanyIndustriesSet;
    logger.info("company.companyIndustriesSet = ", $scope.company.companyIndustriesSet);

    $scope.company.editCompanySocialMediaLinks = [{
      "socialMediaName":"Facebook",
      "socialMediaValue":$scope.company.facebook?$scope.company.facebook:""
    },
    {
      "socialMediaName":"LinkedIn",
      "socialMediaValue":$scope.company.linkedin
    },
    {
      "socialMediaName":"Twitter",
      "socialMediaValue":$scope.company.twitter
    }];

    $scope.company.establishedDate = $scope.company.establishedMon +" "+ $scope.company.establishedYear;
    logger.info("Established Date : "+$scope.company.establishedDate);

    var url = baseUrl + 'api/saveCompany';
    showSavingCompanyProfileAnimate();

    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.company))
      .then(function successCallback(response) {
        if (response.status === 'success'){
          $scope.user.company=$scope.company;
          localStorage.setItem("userData",JSON.stringify($scope.user));
          showSavedCompanyProfileAnimate();

        } else {
          showErrorMessageForSavedCompanyProfile(response.msg.description);
        }
      });
  };


  // ===============================================================================================
  // ====================================== Settings ========================================
  // ===============================================================================================

  // Init Settings Data.
  $scope.recruiterSettings = filterSettings($scope.userdata.recruiterSettings);

  // Settings.
  function filterSettings(settings) {
    console.log("Settings: ", settings);
    settings.jobIsActive.mobile = (settings.jobIsActive.mobile == 1) ?  true : false;
    settings.jobIsActive.email = (settings.jobIsActive.email == 1) ?  true : false;

    settings.jobIsClosed.mobile = (settings.jobIsClosed.mobile == 1) ?  true : false;
    settings.jobIsClosed.email = (settings.jobIsClosed.email == 1) ?  true : false;

    settings.newCandidates.mobile = (settings.newCandidates.mobile == 1) ?  true : false;
    settings.newCandidates.email = (settings.newCandidates.email == 1) ?  true : false;

    settings.newMatch.mobile = (settings.newMatch.mobile == 1) ?  true : false;
    settings.newMatch.email = (settings.newMatch.email == 1) ?  true : false;

    settings.someoneInterested.mobile = (settings.someoneInterested.mobile == 1) ?  true : false;
    settings.someoneInterested.email = (settings.someoneInterested.email == 1) ?  true : false;

    return settings;
  }

  $scope.saveSettings = function(){
    logger.info("Saving recruiter settings: "+JSON.stringify($scope.recruiterSettings));
    var map = {};
    map.recruiterSettings = {};
    map.recruiterSettings.newCandidates = {};
    map.recruiterSettings.newCandidates.email = $scope.recruiterSettings.newCandidates.email ? 1 :0;
    map.recruiterSettings.newCandidates.mobile = $scope.recruiterSettings.newCandidates.mobile ? 1 :0;

    map.recruiterSettings.someoneInterested = {};
    map.recruiterSettings.someoneInterested.email = $scope.recruiterSettings.someoneInterested.email ? 1 :0;
    map.recruiterSettings.someoneInterested.mobile = $scope.recruiterSettings.someoneInterested.mobile ? 1 :0;

    map.recruiterSettings.newMatch = {};
    map.recruiterSettings.newMatch.email = $scope.recruiterSettings.newMatch.email ? 1 :0;
    map.recruiterSettings.newMatch.mobile = $scope.recruiterSettings.newMatch.mobile ? 1 :0;

    map.recruiterSettings.jobIsActive = {};
    map.recruiterSettings.jobIsActive.email = $scope.recruiterSettings.jobIsActive.email ? 1 :0;
    map.recruiterSettings.jobIsActive.mobile = $scope.recruiterSettings.jobIsActive.mobile ? 1 :0;

    map.recruiterSettings.jobIsClosed = {};
    map.recruiterSettings.jobIsClosed.email = $scope.recruiterSettings.jobIsClosed.email ? 1 :0;
    map.recruiterSettings.jobIsClosed.mobile = $scope.recruiterSettings.jobIsClosed.mobile ? 1 :0;

    var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/updateRecruiterSettings';
    showSavingSettingsAnimate();

    HttpClientHelper.ExecutePostMethod(url,JSON.stringify(map)).then(function successCallback(response) {
      if (response.status === 'success' ) {

        //setting cache data
        $scope.userdata.recruiterSettings= filterSettings($scope.recruiterSettings);
        localStorage.setItem("userData",JSON.stringify($scope.userdata) );

        showSavedSettingsAnimate();
        // $scope.successMessage = response.msg.description;
        // $scope.success=true;
        // messageFactory.setSuccess(true);
      } else {
        showErrorMessageForSavedSettings(response.msg.description);
        // $scope.errorMessage = response.msg.description;
        // $scope.error=true;
        // messageFactory.setError(true);
      }
    });
  };
}]);
