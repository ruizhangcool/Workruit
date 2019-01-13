/**
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input.toString().split(splitChar)[splitIndex];
    }
});

workruitApp.controller('companyController',
  ['$scope','$filter','$rootScope','$routeParams', '$http', '$location', 'workruitService','messageFactory','logger','HttpClientHelper',
    function($scope, $filter,$rootScope,$routeParams, $http, $location, workruitService,messageFactory,logger,HttpClientHelper) {

	$scope.errorMessage = "";
	$scope.nav.navBar = false;
  $scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
  $scope.user =  JSON.parse(localStorage.getItem("userData"));
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
  if (!($scope.user.company === 'undefined')) {
    $scope.company = {};
  }else{
    $scope.company = $scope.user.company;
  }
  $scope.industryDropDownSettings = { selectionLimit: 3,scrollableHeight: '200px', scrollable: true};
  $scope.userId = $routeParams.userId;
  if($routeParams.companyName){
    var replaced = $routeParams.companyName.replace(/\+/g, " ");
    logger.info("company name "+replaced);
    $scope.company.companyName=replaced;
    $scope.company.userId=$routeParams.userId
  }


 var masterData = localStorage.getItem("masterData");
 masterData = masterData.replace(/industryId/g, 'id');
 masterData = masterData.replace(/industryName/g, 'label');

 var masterDataCompany =JSON.parse(masterData);

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


 $scope.industrylist = masterDataCompany.industries;

 $scope.industry=[];

	$scope.x ="";
	$scope.y ="";
	$scope.z ="";

	//in controller
	$scope.init = function () {

    logger.info("INIT - COMPANY - CONTROLLER");

    $scope.userId = $routeParams.userId;
    logger.info("Hello You Are In Init :: " + $scope.userId);

    $scope.user = JSON.parse(localStorage.getItem("userData"));
  };

	$scope.saveCompany = function() {


    // do Validation and return

    logger.info("saveCompany Called! - in save Mode");
    var d = new Date();
    var n = d.getFullYear();
    var m = d.getMonth();

    if($scope.company.establishedYear > n || ($scope.company.establishedYear == n && $scope.months.indexOf($scope.company.establishedMon) > m)){
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
      logger.info(locationList[i].title+"--"+$scope.company.location.title);
      if(locationList[i].title === $scope.company.location.title){
        loc=locationList[i];
        break;
      }
    }

    logger.info(loc);
    $scope.company.location=loc;
    var sizeList = $scope.masterData.companySizes;

    var s ;
    for(var i=0;i<sizeList.length;i++){
      logger.info(sizeList[i].csTitle+"--"+$scope.company.size.csTitle);
      if(sizeList[i].csTitle === $scope.company.size.csTitle){
        s=sizeList[i];
        break;
      }
    }
    logger.info(s);
    $scope.company.size=s;

    var industryArray = $scope.industry;
    logger.info("---------------------------------------------------------");
    logger.info(JSON.stringify(industryArray));

    $scope.company.companyIndustriesSet = [];
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
      $scope.company.companyIndustriesSet.push(industry);
    }

    $scope.company.companyIndustriesSet = $scope.company.companyIndustriesSet;


    $scope.company.companySocialMediaLinks = [{
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

    //logger.info("WR User ID : "+$scope.company.userId);
    //logger.info("WR company ID : "+$scope.company.companyId);

    $scope.company.establishedDate = $scope.company.establishedMon +" "+ $scope.company.establishedYear;

    logger.info("Established Date : "+$scope.company.establishedDate);
    $scope.company.userId= $scope.userId;
    $scope.company.picture="";

    var url = baseUrl + 'api/saveCompany';
    HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.company))
      .then(function successCallback(response) {
      if ( response.status === 'success' ) {
        //logger.info("SUCCESS--Returning To Welcome");
        $scope.nav.navBar 	= true;
        $scope.company.companyId=response.data;
        $scope.user.company=$scope.company;


        localStorage.setItem("userData",JSON.stringify($scope.user) );
        $scope.uploadFile();

      } else {
        $scope.errorMessage = response.msg.description;
        $scope.error=true;
        messageFactory.setError(true);
        logger.info("ERROR : "+$scope.errorMessage );
      }
    });

	};

	$scope.validateFormData = function() {
		return true;
	};


	$scope.viewCompany = angular.copy(workruitService.userdata.company);
	$scope.company = angular.copy($scope.viewCompany);

	$scope.companyName = $routeParams.companyName.replace(/\+/g, " ");
	//job role removed from company
	//$scope.userJobRole = $routeParams.userJobRole;
	$scope.userId = $routeParams.userId;

	if (!$scope.company) {
		//If company doesnot exist...after clicking email link by recruiter
		//alert("! scope Called!");
		$scope.company = {};

    var replaced = $routeParams.companyName.replace(/\+/g, " ");
    logger.info("company name "+replaced);
    $scope.company.companyName=replaced;

		localStorage.setItem("userId", $scope.userId);
	}else{
    var replaced = $routeParams.companyName.replace(/\+/g, " ");
    logger.info("company name "+replaced);
    $scope.company.companyName=replaced;
  }


   function dataURItoBlobAbout(dataURI) {
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


   $scope.uploadFile = function(){
     if($scope.companyImagesave ==true){   
         var blob = dataURItoBlobAbout($scope.myCroppedImage);
         var fd = new FormData();
         // var file = element.files[0];
         fd.append('file', blob);

         var urlData = baseUrl + '/api/uploadCompanyLogo?companyId='+$scope.user.company.companyId;

         $http.post(urlData, fd, {
           transformRequest: angular.identity,
           headers: {'Content-Type': undefined,'Token': localStorage.getItem("sessionId")}
         })
           .success(function(response){
             logger.info(response);
             logger.info("--------------"+response);
             var parsedJSON = JSON.parse(response);
             workruitService.uploadedPicPath = parsedJSON.data.filePath;
             $scope.companyPicture=$scope.imageUrl+parsedJSON.data.filePath;
             $scope.company.picture=$scope.imageUrl+parsedJSON.data.filePath;
             $scope.user.company.picture=$scope.imageUrl+parsedJSON.data.filePath;
             localStorage.setItem("userData",JSON.stringify($scope.user) );
             localStorage.setItem("companyImage",parsedJSON.data.filePath);

             $scope.myImage='';
             $scope.myCroppedImage='';
             $location.path('welcome');

           })
           .error(function(){
           });
     }else{
         localStorage.setItem("userData",JSON.stringify($scope.user) );
         localStorage.setItem("companyImage",'');

         $scope.myImage='';
         $scope.myCroppedImage='';
         $location.path('welcome');
     }
	  };

   $scope.aliasUploadFile = function(){
     logger.info($scope.myCroppedImage);
     $scope.company.picture=$scope.myCroppedImage;
     logger.info("Company Image :"+$scope.company.picture);
     $scope.companyImagesave = true;
   };


   $scope.company.facebook="https://www.facebook.com/";
   $scope.company.linkedin="https://www.linkedin.com/";
   $scope.company.twitter="https://www.twitter.com/";

   var year = new Date().getFullYear();
	  var range = [];
	  range.push(year);
	  for(var i=1;i<(year-1974);i++) {
	    range.push(year - i);
	  }
	  range.push("Before 1975");
	  $scope.years = range;
}]);



workruitApp.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);



