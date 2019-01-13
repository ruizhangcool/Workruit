/**
 * @name: Mahesh
 * @editCompany: Workruit
 *
 * performs the signup for the recruiters
 *
 */

var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('editCompanyController', ['$scope', '$filter', '$http', '$location', 'workruitService','messageFactory','logger','HttpClientHelper',
  function($scope,$filter, $http, $location, workruitService,messageFactory,logger,HttpClientHelper) {


    var userData = localStorage.getItem("userData");
    userData = userData.replace(/recruiterCompanyName/g, 'companyName');
    localStorage.setItem("userData",userData);
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

    $scope.userdata =  JSON.parse(localStorage.getItem("userData"));

    $scope.usercreds = {};

    $scope.editCompany = {};

    $scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
    $scope.companyList = [];
    $scope.OriginalcompanyList = [];
    var companyMasterData = $scope.masterData.companyNameId;

    for (var i =0; i< companyMasterData.length;i++ ){
      $scope.companyList.push(companyMasterData[i].masterCompanyName);
      $scope.OriginalcompanyList.push(companyMasterData[i].masterCompanyName);
    }
    $scope.years = [];

    var year = new Date().getFullYear();
    $scope.years .push(year.toString());
    for (var i = 1; i < (year - 1974); i++) {
      $scope.years .push((year - i).toString());
    }
    $scope.years.push("Before 1975");

    ///////////Start



    $scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
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


    //////////end


    $scope.industryDropDownSettings = { selectionLimit: 3,scrollableHeight: '200px', scrollable: true};

    var masterData = localStorage.getItem("masterData");
    masterData = masterData.replace(/industryId/g, 'id');
    masterData = masterData.replace(/industryName/g, 'label');

    var masterDataCompany =JSON.parse(masterData);

    $scope.industrylist = masterDataCompany.industries;




    logger.info("16 $scope.userdata-userId  "+ $scope.userdata.userId);

    if ($scope.userdata.userId === undefined){

      logger.info("Hello You Are In Init :: "+$scope.userId);

      if ($scope.userId === undefined){
        $scope.userId = localStorage.getItem("userId");
        logger.info("User Id From Local Storage :: "+$scope.userId);
      }

      logger.info("ViewProfile promise.userdata : "+$scope.user.userId);
      logger.info("ViewProfile promise. company about "+$scope.user.company.about);

      //$scope.editCompany = $scope.user.company;
      $scope.editCompany = angular.copy($scope.user.company);

      var establishedMon = $filter('split')($scope.editCompany.establishedDate,' ',0);
      var establishedYear = $filter('split')($scope.editCompany.establishedDate,' ',1);
      logger.info(establishedYear);

      //$scope.selectedUserRole = $scope.editCompany[0];
      $scope.editCompany.establishedMon = $scope.months[$scope.months.indexOf(establishedMon)];
      logger.info("promise $scope.editCompany.establishedMon "+$scope.editCompany.establishedMon);
      logger.info($scope.years);
        $scope.editCompany.establishedYear = $scope.years[$scope.years.indexOf(establishedYear)];
        logger.info($scope.years.length);


      logger.info("promise $scope.editCompany.establishedYear "+$scope.editCompany.establishedYear);
      //$scope.company = angular.copy($scope.editCompany);

      try {
        var i;

        if (workruitService.uploadedPicPath)
          $scope.editCompany.picture = workruitService.uploadedPicPath;
        $scope.editCompany.picture = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+"/images"+$scope.editCompany.picture;

        //dont remove or comment this line.
        $scope.nav.navBar = true;

      } catch (e) {

      }





    }
    else {
      //this case for login

      $scope.editCompany = $scope.userdata.company;

      if ($scope.editCompany) {

        logger.info("editCompany login - "+$scope.userdata.userId);
        logger.info(JSON.stringify($scope.editCompany));
        $scope.editCompany.industry=[];
        var industry = $scope.userdata.company.companyIndustriesSet;
        for(var i =0;i< industry.length;i++){
          logger.info("loading .... tags");
          logger.info(JSON.stringify(industry[i]));
          var skill ={};
          skill['label']= industry[i].industry.industryName;
          skill['id']= industry[i].industry.industryId;
          $scope.editCompany.industry.push(skill);
        }

        var establishedMon = $filter('split')($scope.editCompany.establishedDate,' ',0);
        var establishedYear = $filter('split')($scope.editCompany.establishedDate,' ',1);
        logger.info("--"+establishedYear+"--");

        //$scope.selectedUserRole = $scope.editCompany[0];
        $scope.editCompany.establishedMon = $scope.months[$scope.months.indexOf(establishedMon)];
        logger.info("promise $scope.editCompany.establishedMon "+$scope.editCompany.establishedMon);
        logger.info($scope.years.length);
        logger.info($scope.years.indexOf(establishedYear));
        $scope.editCompany.establishedYear = $scope.years[$scope.years.indexOf(establishedYear)];
          logger.info($scope.years.length);

        logger.info("promise $scope.editCompany.establishedYear "+$scope.editCompany.establishedYear);
        //$scope.company = angular.copy($scope.editCompany);

        $scope.company = angular.copy($scope.editCompany);
        $scope.user = angular.copy($scope.userdata);

        try {
          var i;
          for(i=0;i<$scope.editCompany.companySocialMediaLinks.length;i++) {
            if ($scope.editCompany.companySocialMediaLinks[i].socialMediaName === 'Facebook')
              $scope.company.facebook = $scope.editCompany.companySocialMediaLinks[i].socialMediaValue;
            else if ($scope.editCompany.companySocialMediaLinks[i].socialMediaName === 'Twitter')
              $scope.company.twitter = $scope.editCompany.companySocialMediaLinks[i].socialMediaValue;
            else if ($scope.editCompany.companySocialMediaLinks[i].socialMediaName === 'LinkedIn')
              $scope.company.linkedin = $scope.editCompany.companySocialMediaLinks[i].socialMediaValue;
          }

          for(i=0;i<$scope.editCompany.companyIndustriesSet.length;i++) {
            $scope.company.companyIndustriesSet[i].industry.industryId =
              $scope.editCompany.companyIndustriesSet[i].industry.industryId;

            $scope.company.companyIndustriesSet[i].industry.industryName =
              $scope.editCompany.companyIndustriesSet[i].industry.industryName;
          }

          $scope.company.location.locationId=""+$scope.editCompany.location.locationId;
          // logger.info("WR View Company location: "+$scope.company.location);
          $scope.company.size.csId=""+$scope.editCompany.size.csId;

          $scope.company.companyName = $scope.userdata.data.recruiterCompanyName;
          logger.info("WR View Company companyName 140 : "+$scope.company.companyName);

          $scope.company.industry = ""+$scope.company.companyIndustriesSet[0].industry.industryId;

          if (workruitService.uploadedPicPath)
            $scope.editCompany.picture = workruitService.uploadedPicPath;
          $scope.editCompany.picture = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+"/images"+$scope.editCompany.picture;

        } catch (e) {

        }

        //logger.info("editCompany 2 is Called!");

        logger.info("VC response OUTSIDE . company about "+$scope.userdata.company.about);

        //dont remove or comment this line.
        $scope.nav.navBar = true;
      }
    }

    //$scope.logger.info = logger.info;

    $scope.validateFormData = function() {
      //$scope.user
      angular.forEach($scope.signupform.$error.required, function(field) {
        field.$setDirty();
      });
      if($scope.signupform.$valid) {
        return true;
      }
      return false;
    }


    $scope.loadEditCompany = function _loadEditCompany() {

      logger.info ("loadEditCompany");

      $scope.editCompany = angular.copy($scope.viewCompany);

      for(i=0;i<$scope.viewCompany.companyIndustriesSet.length;i++) {
        $scope.editCompany.companyIndustriesSet[i].industry.industryId =
          $scope.viewCompany.companyIndustriesSet[i].industry.industryId;

        $scope.editCompany.companyIndustriesSet[i].industry.industryName =
          $scope.viewCompany.companyIndustriesSet[i].industry.industryName;
      }

      $location.path('editCompany');
    }


    $scope.saveCompany = function() {

      var d = new Date();
      var n = d.getFullYear();
      var m = d.getMonth();

      if($scope.editCompany.establishedYear > n || ($scope.editCompany.establishedYear == n && $scope.months.indexOf($scope.editCompany.establishedMon) > m)){
        $scope.errorMessage = "Founded date should be less than or equal to current date.";
        $scope.error=true;
        messageFactory.setError(true);
        logger.info( $scope.errorMessage );
        return false;
      }


      var location={};
      var size={};

      var locationList = $scope.masterData.locations;
      var loc ;
      for(var i=0;i<locationList.length;i++){
        logger.info(locationList[i].title+"--"+$scope.editCompany.location.title);
        if(locationList[i].title === $scope.editCompany.location.title){
          loc=locationList[i];
          break;
        }
      }

      logger.info(loc);
      $scope.editCompany.location=loc;
      var sizeList = $scope.masterData.companySizes;

      var s ;
      for(var i=0;i<sizeList.length;i++){
        logger.info(sizeList[i].csTitle+"--"+$scope.editCompany.size.csTitle);
          if(sizeList[i].csTitle === $scope.editCompany.size.csTitle){
            s=sizeList[i];
            break;
          }
      }
      logger.info(s);
      $scope.editCompany.size=s;



      // do Validation and return

      logger.info("saveCompany Called! - in EDIT Mode");

      if (!$scope.validateFormData()) {
        logger.info($scope.validateFormData());
        $scope.errorMessage = "Required fields missing";
        $scope.error=true;
        messageFactory.setError(true);
        return;
      }

      var industryArray = $scope.editCompany.industry;
      logger.info("---------------------------------------------------------");
      logger.info(JSON.stringify(industryArray));

      $scope.editCompany.editCompanyIndustriesSet = [];
      for(var i =0 ; i< industryArray.length;i++){
        var industry={};
        var industryIdMap={};
        industryIdMap["industryId"] = industryArray[i].id;

        var industry2 = $scope.industrylist.filter(function(ind) {
          return ind.id == industryArray[i].id;
        });

        logger.info(JSON.stringify(industry2));

        industryIdMap["industryName"] = industry2[0].label;
        industry["industry"] = industryIdMap;
        $scope.editCompany.editCompanyIndustriesSet.push(industry);
      }

      $scope.editCompany.companyIndustriesSet = $scope.editCompany.editCompanyIndustriesSet;


      $scope.editCompany.editCompanySocialMediaLinks = [{
        "socialMediaName":"Facebook",
        "socialMediaValue":$scope.editCompany.facebook?$scope.editCompany.facebook:""
      },
        {
          "socialMediaName":"LinkedIn",
          "socialMediaValue":$scope.editCompany.linkedin
        },
        {
          "socialMediaName":"Twitter",
          "socialMediaValue":$scope.editCompany.twitter
        }];

      //logger.info("WR User ID : "+$scope.editCompany.userId);
      //logger.info("WR editCompany ID : "+$scope.editCompany.editCompanyId);

      $scope.editCompany.establishedDate = $scope.editCompany.establishedMon +" "+ $scope.editCompany.establishedYear;

      logger.info("Established Date : "+$scope.editCompany.establishedDate);

      var url = baseUrl + 'api/saveCompany';
      HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.editCompany))
        .then(function successCallback(response) {
        if (response.status === 'success' ) {
          //logger.info("SUCCESS--Returning To Welcome");
          $scope.nav.navBar 	= true;
          $scope.user.company=$scope.editCompany;
          localStorage.setItem("userData",JSON.stringify($scope.user) );
          $location.path('viewCompany');

        } else {
          $scope.errorMessage = response.msg.description;
          $scope.error=true;
          messageFactory.setError(true);
          logger.info("ERROR : "+$scope.errorMessage );
        }
      });

    };

    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
      else
        byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }
    function isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
    $scope.uploadFile = function(element){
      logger.info($scope.myImage);
      var blob = dataURItoBlob($scope.myCroppedImage);
      var fd = new FormData();
     // var file = element.files[0];
      fd.append('file', blob);
      //logger.info(file);
      logger.info($scope.editCompany);
      var urlData = baseUrl + 'api/uploadCompanyLogo?companyId='+$scope.editCompany.companyId;

      $http.post(urlData, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined,'Token': localStorage.getItem("sessionId")}
      })
        .success(function(response){
 
          var parsedJson;
          try{
            parsedJson = JSON.parse(response);
          }catch(e){
            parsedJson = response;
          }  
         //logger.info(JSON.stringify(response));
          //logger.info(parsedJson.data.filePath);
          $scope.editCompany = angular.copy($scope.user.company);
          $scope.editCompany.picture = parsedJson.data.filePath;
          $scope.companyPicture=$scope.imageUrl+parsedJson.data.filePath;

          //Changing cache value

          $scope.user.company.picture=parsedJson.data.filePath;
          localStorage.setItem("userData",JSON.stringify($scope.user) );
          localStorage.setItem("companyImage",parsedJson.data.filePath);
          $scope.myImage='';
          $scope.myCroppedImage='';


        })
        .error(function(){
        });
    };

    $scope.validateFormData = function() {
      //$scope.user
      angular.forEach($scope.signupform.$error.required, function(field) {
        field.$setDirty();
      });
      if($scope.signupform.$valid) {
        return true;
      }
      return false;
    };

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
