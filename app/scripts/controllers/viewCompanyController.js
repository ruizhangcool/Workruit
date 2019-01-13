/**
 * @name: Mahesh
 * @company: Workruit
 *
 * performs the signup for the recruiters
 *
 */

var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('viewCompanyController', ['$scope', '$http', '$location', 'workruitService','logger','HttpClientHelper',
  function($scope, $http, $location, workruitService,logger,HttpClientHelper) {
    //$scope.userdata =  workruitService.userdata;

    $scope.user =  JSON.parse(localStorage.getItem("userData"));
    $scope.userdata =  JSON.parse(localStorage.getItem("userData"));
    $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
    $scope.usercreds = {};

    logger.info("14 $scope.userdata-userId  "+ $scope.userdata.userId);

      //this case for login
      logger.info("72 ELSE  - workruitService.user "+$scope.userdata.userId);
      $scope.viewBeforeCompany = angular.copy($scope.userdata.company);

      if ($scope.viewBeforeCompany) {
        $scope.editCompany = angular.copy($scope.viewBeforeCompany);
        var url = baseUrl + '/api/'+$scope.editCompany.companyId+'/getCompanyProfile';
        HttpClientHelper.ExecuteGetMethod(url).then(function successCallback(response) {
          logger.info("viewCompany login - "+$scope.userdata.userId);
          logger.info("ViewCompany response. company about "+$scope.userdata.company.about);

          $scope.company = response.data;
          $scope.viewCompany = $scope.company;
          $scope.user = angular.copy($scope.userdata);

          try {
            var i;
            for(i=0;i<$scope.viewCompany.companySocialMediaLinks.length;i++) {
              if ($scope.viewCompany.companySocialMediaLinks[i].socialMediaName === 'Facebook')
                $scope.company.facebook = $scope.viewCompany.companySocialMediaLinks[i].socialMediaValue;
              else if ($scope.viewCompany.companySocialMediaLinks[i].socialMediaName === 'Twitter')
                $scope.company.twitter = $scope.viewCompany.companySocialMediaLinks[i].socialMediaValue;
              else if ($scope.viewCompany.companySocialMediaLinks[i].socialMediaName === 'LinkedIn')
                $scope.company.linkedin = $scope.viewCompany.companySocialMediaLinks[i].socialMediaValue;
            }

            for(i=0;i<$scope.viewCompany.companyIndustriesSet.length;i++) {
              $scope.company.companyIndustriesSet[i].industry.industryId =
                $scope.viewCompany.companyIndustriesSet[i].industry.industryId;

              $scope.company.companyIndustriesSet[i].industry.industryName =
                $scope.viewCompany.companyIndustriesSet[i].industry.industryName;
            }

            $scope.company.location=""+$scope.viewCompany.location.title;
            logger.info("WR View Company location: "+$scope.company.location);
            $scope.company.size=$scope.viewCompany.size;

            $scope.company.companyName = $scope.userdata.data.recruiterCompanyName;
            logger.info("WR View Company companyName: "+$scope.company.companyName);

            $scope.company.industry = ""+$scope.company.companyIndustriesSet[0].industry.industryId;

            if (workruitService.uploadedPicPath)
              $scope.viewCompany.picture = workruitService.uploadedPicPath;
            $scope.viewCompany.picture = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '')+"/images"+$scope.viewCompany.picture;
          } catch (e) {

          }


        });

        //alert("viewCompany 2 is Called!");


        //dont remove or comment this line.
        $scope.nav.navBar = true;
      }

    $scope.alert = alert;

    $scope.validateFormData = function() {

      return true;
    }


    $scope.loadEditCompany = function _loadEditCompany() {

      logger.info ("loadEditCompany");

      $scope.editCompany = angular.copy($scope.viewCompany);

      var url = baseUrl + '/api/'+$scope.editCompany.companyId+'/getCompanyProfile';
      HttpClientHelper.ExecuteGetMethod(url).then(function successCallback(response) {
        $scope.editCompany = response.data;
        for(i=0;i<$scope.viewCompany.companyIndustriesSet.length;i++) {
          $scope.editCompany.companyIndustriesSet[i].industry.industryId =
            $scope.viewCompany.companyIndustriesSet[i].industry.industryId;

          $scope.editCompany.companyIndustriesSet[i].industry.industryName =
            $scope.viewCompany.companyIndustriesSet[i].industry.industryName;
        }
        var establishedDate = response.data.establishedDate;
        $scope.editCompany.establishedMon= establishedDate.split(" ")[0];
        $scope.editCompany.establishedYear= establishedDate.split(" ")[1];
        logger.info(JSON.stringify($scope.editCompany));
        $scope.user.company=$scope.editCompany;
        localStorage.setItem("userData",JSON.stringify($scope.user) );

        $location.path('editCompany');


      });
    }
  }]);
