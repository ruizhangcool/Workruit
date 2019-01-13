var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('manageProfileGeneralController', ['$scope', '$location', '$routeParams', '$http','messageFactory','logger','HttpClientHelper',
  function($scope, $location, $routeParams, $http,messageFactory,logger,HttpClientHelper) {

    $scope.errorMessage="";
     $scope.successMessage="";
    $scope.success=false;
    $scope.error=false;
  $scope.newsletter = false;
  $scope.promotionsr = false;
  $scope.settings = {};

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

    var key = $location.search().key;
    logger.info("Key--"+key);

    var url = baseUrl +baseUrl + 'email/emailprofile?key='+key;
    HttpClientHelper.ExecuteGetMethod(url)
      .then(function successCallback(response) {
      if (response.status === 'success' ) {

        logger.info(response.data);
        $scope.isApplicant = response.isApplicant;
        if($scope.isApplicant){
          $scope.newsletter = response.data.applicantNewsletter;
          if(response.data.applicantIncompleteProfile){
            $scope.promotionsr = true;
          }else{
            $scope.promotionsr = false;
          }

          if(!($scope.newsletter || $scope.promotionsr) ){
            $scope.unsubscribeAll = true;
          }
        }

        if(!$scope.isApplicant){
          $scope.newsletter = response.data.companyNewsletter;
          if(response.data.companyNoJobposts || response.data.companyProfileIncomplete){
            $scope.promotionsr = true;
          }else{
            $scope.promotionsr = false;
          }

          if(!($scope.newsletter || $scope.promotionsr) ){
            $scope.unsubscribeAll = true;
          }
        }

        //$scope.successMessage = response.data.msg.description;
        //$scope.success=true;
        //messageFactory.setSuccess(true);
      } else {
        $scope.errorMessage = response.msg.description;
        $scope.error=true;
        messageFactory.setError(true);
      }
    });

  $scope.updatePromoterbox = function(){
    if($scope.promotionsr ){
      $scope.unsubscribeAll = false;
    }

    if(!$scope.promotionsr ){
      $scope.unsubscribeAll = false;
    }

    if($scope.newsletter && $scope.promotionsr ){
      $scope.unsubscribeAll = true;
    }
  };

  $scope.updateNewsLetterbox = function(){
    if($scope.newsletter ){
      $scope.unsubscribeAll = false;
    }

    if(!$scope.newsletter ){
      $scope.unsubscribeAll = false;
    }

    if($scope.newsletter && $scope.promotionsr ){
      $scope.unsubscribeAll = true;
    }
  };

  $scope.updateUnsubscribebox = function(){
    logger.info("unsubscribe ::"+$scope.unsubscribeAll);
    if($scope.unsubscribeAll ){
      $scope.promotionsr = false;
      $scope.newsletter = false;
    }
  };


     $scope.saveSettings = function(){
        logger.info("------ Saving Settings --------");
       logger.info($scope.newsletter);
       logger.info($scope.promotionsr);

       $scope.settings.key= key;
       $scope.settings.newsletter= $scope.newsletter;
       $scope.settings.promotionsr= $scope.promotionsr;


       var url = baseUrl + 'api/updateEmailProfilePromotions';
       HttpClientHelper.ExecutePostMethod(url,JSON.stringify($scope.settings))
         .then(function successCallback(response) {
          if (response.status === 'success' ) {

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
