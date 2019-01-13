/**
 *
 */
var workruitApp = angular.module('workruitUiApp');
workruitApp.controller('chatController', ['$scope','$http', '$location', 'workruitService','messageFactory','$routeParams',
  'logger','HttpClientHelper','$firebase','$filter','$timeout','$rootScope','$sce',
  function($scope, $http, $location, workruitService,messageFactory,$routeParams,logger,HttpClientHelper,
           $firebase,$filter,$timeout,$rootScope,$sce) {

    $scope.alert = alert;

    $scope.userdata =  JSON.parse(localStorage.getItem("userData"));
    $scope.masterData = JSON.parse(localStorage.getItem("masterData"));
    $scope.message=2;
    $scope.success=false;
    $scope.error=false;
    $scope.job= {};
    $scope.newMessage = "";

    $scope.user =  JSON.parse(localStorage.getItem("userData"));
    $scope.email = $scope.user.email;


    $scope.recruiterInterestedProfilesLength =0;
    $scope.recruiterApplicantMatchesLength =0;

    var ref = new Firebase('https://workruit-f6542.firebaseio.com');


    if($routeParams.tab){
      $scope.tab = $routeParams.tab;
    }



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

    //$scope.masterdata = workruitService.masterdata;

    logger.info("Chat Controller : 11 $scope.userdata-userId  "+ $scope.userdata.userId);

    if ($scope.userdata.userId === undefined){

      logger.info("Hello You Are In Init :: "+$scope.userId);

      if ($scope.userId === undefined){
        $scope.userId = localStorage.getItem("userId");
        logger.info("User Id From Local Storage :: "+$scope.userId);
      }

    }


    $scope.showMatchedChat = function _showMatched(isMatched){
      if (isMatched) {
        $scope.message=2;
        $scope.tab = 'matched';
        logger.info("matched");
        $scope.candidate = workruitService.candidateProfile;
        $scope.job = workruitService.userJobs;
        logger.info("Candidate data ",$scope.candidate);

        var url = baseUrl + 'api/user/'+localStorage.getItem("userId")+'/recruiterApplicantMatches';
        HttpClientHelper.ExecuteGetMethod(url).then(
          function (response) {
            //$scope.nav.activeTab = "activity";
            if (response.status === 'success' ) {

              //$scope.shortListedProfiles = JSON.parse(response.data);

              $scope.recruiterApplicantMatches = response.data;
              //Setup unread count
              $scope.setupUnreadCount($scope.recruiterApplicantMatches);

              $scope.recruiterApplicantMatchesLength = $scope.recruiterApplicantMatches.length;

              if($scope.recruiterApplicantMatchesLength > 0 && Object.keys($scope.candidate).length === 0 ){
                $scope.candidate = $scope.recruiterApplicantMatches[0].userId;
                $scope.job = $scope.recruiterApplicantMatches[0].jobPostId;

              }

              if(localStorage.getItem("chatMessageObject")!= undefined){

                for(var i =0 ;i<$scope.recruiterApplicantMatches.length;i++){

                  console.log("===================================================")
                  console.log($scope.recruiterApplicantMatches[i].userId.userId +"-------"+localStorage.getItem("chatMessageObject"));
                  var channel = 'workruit_v1'+$scope.recruiterApplicantMatches[i].jobPostId.jobPostId+$scope.recruiterApplicantMatches[i].userId.userId;
                  if(channel == localStorage.getItem("chatMessageObject")){
                    console.log("Setting the user object ")
                    $scope.candidate = $scope.recruiterApplicantMatches[i].userId;
                    $scope.job = $scope.recruiterApplicantMatches[i].jobPostId;
                  }

                }

              }

              localStorage.removeItem("chatMessageObject");




              $scope.loadFullProfileChat($scope.candidate,$scope.job);



              if ($scope.recruiterApplicantMatches.length>0) {
                $scope.message=1;
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
            $scope.errorMessage = "Something wrong with the action, please try again";
            $scope.error=true;
            messageFactory.setError(true);
          });

      }

    }

    $scope.filterMatched = function(jobMatch){
      return jobMatch.jobseekerStatus && jobMatch.recruiterStatus;
    }

    $scope.editPostJob = function(jobsData) {
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
    $scope.unreadCount = {};
    var applicantUnreadCount = {};
    var recruiterUnreadCount = {};
    var totalMessagesForChannel = {};
    $scope.setupUnreadCount = function _setupUnreadCount(profiles){

      for (var i=0;i<profiles.length;i++){

        var channel = 'workruit_v1'+profiles[i].jobPostId.jobPostId+profiles[i].userId.userId+"_"+$scope.user.userId;
        $firebase(ref.child(channel)).$asObject().$loaded().then(function(title) {
          recruiterUnreadCount["workruit_"+title.$id.split("_")[1]] = title.$value == null ? 0 : title.$value  ;
          channel = 'workruit_'+title.$id.split("_")[1];
          loadDatabaseCount(channel);
        });
      }

    }

    function loadDatabaseCount(channel){
      $firebase(ref.child("channels/"+channel)).$asArray().$loaded().then(function(title) {
        //console.log(JSON.stringify(title));
        try{
          totalMessagesForChannel[title[0].channel] = title.length == null ? 0 : title.length  ;
          loadFinalUnreadCount(channel);
        }catch(err){
          logger.error(err);
        }
      });
    }

    function loadFinalUnreadCount(channel){
      console.log(channel +"--"+totalMessagesForChannel[channel]+"--"+recruiterUnreadCount[channel]);
      $scope.unreadCount[channel] = totalMessagesForChannel[channel]- (recruiterUnreadCount[channel]);
     // $scope.$apply(function(){$scope.unreadCount = $scope.unreadCount;});
    }

    var messages ="";
    $scope.loadFullProfileChat = function _loadFullProfile(profiles,jobData) {
      logger.info("loadFullProfile");
      workruitService.candidateProfile = profiles;
      workruitService.userJobs = jobData;
      logger.info(JSON.stringify(profiles));
      logger.info(JSON.stringify(jobData));
      $scope.candidate = workruitService.candidateProfile;
      $scope.job = workruitService.userJobs;
      //$location.path('applicantsProfile');
      //Removing the chat date
      localStorage.removeItem("lastChatDate");

      logger.info("Reference :",ref);
      var channel = 'channels/workruit_v1'+jobData.jobPostId+profiles.userId;
      logger.info(channel);
      var messages = $firebase(ref.child(channel)).$asArray();
      console.log(messages);
      logger.info("object ",JSON.stringify(messages));

      $scope.unreadCount['workruit_v1'+jobData.jobPostId+profiles.userId] = 0;

      $scope.messages= messages;

      $timeout(function() {
        var scroller = document.getElementsByClassName("chat_block")[0];
        //console.log("-----"+scroller.scrollHeight);
        scroller.scrollTop = scroller.scrollHeight+100;
      }, 1000, false);
    }

    $scope.loadFullProfileInterested = function _loadFullProfileInterested(profiles,jobData) {
      logger.info("loadFullProfileInterested");
      workruitService.candidateProfile = profiles;
      workruitService.userJobs = jobData;
      $location.path('applicantsInterestedProfile');
    }

    $scope.getJobFunctionName = function(jobFunctionId) {
      var i=0;
      for(i;i<$scope.masterData.jobFunctions.length;i++) {
        if ($scope.masterData.jobFunctions[i].jobFunctionId === jobFunctionId[0])
          return $scope.masterData.jobFunctions[i].jobFunctionName;
      }
      return "";
    }


      $scope.showMatchedChat(true);


    $scope.doPublish = function (){
      publish();
    }

    $scope.loadInterested = function(){
      $scope.tab = 'interested';
      $location.url('activity?tab=interested');
    }

    $scope.loadMatched = function(){
      $scope.tab = 'matched';
      $location.url('activity?tab=matched');
    }


    $scope.sendMessage = function(){
      var d = new Date();
      var n = d.getTime();
      var formatDate = $filter('date')(d, "yyyy-MM-dd HH:mm:ss",'+0000');
      var channel = 'workruit_v1'+workruitService.userJobs.jobPostId+workruitService.candidateProfile.userId;

      if($scope.newMessage === undefined || $scope.newMessage =="" || $scope.newMessage.length ==0){
        return;
      }

      var jobRoles = $scope.masterData.jobRoles;
      var jobRoleName = "";
      for(var i=0;i<jobRoles.length;i++){
        if(jobRoles[i].jobRoleId === $scope.user.jobRoleId){
          jobRoleName = jobRoles[i].jobRoleName;
        }
      }


      var localMessage = $scope.newMessage;
      //Send Push Notification
      var notificationMessage = {};

      var notification = {};
      notification.source= workruitService.candidateProfile.deviceType;
      notification.sound = "bingbong.aiff";
      notification.msg =  localMessage ;
      notification.msg_id= n+"";
       var role ='';
       if($scope.user.jobRoleId==1){
            role = "Human Resources";
       } else if($scope.user.jobRoleId==2){
            role = "Founder";
       }else if($scope.user.jobRoleId==3) {
            role = "Employee";
       }
      if(workruitService.candidateProfile.deviceType == 'Android'){
        notification.title=$scope.user.firstname +" "+ $scope.user.lastname;
        notification.subtitle=role; // Change this to role text
      }
      notification.from_id= $scope.email;
      notification.timestamp= n+"";
      if(workruitService.candidateProfile.deviceType == 'Android'){
        notification.badge= 0;
      }else{
         notification.badge= 1;
      }
      notification.body= "You have a new message from "+$scope.user.firstname+" ("+$scope.user.recruiterCompanyName+").";


      notification.plot= "Android";
      notification.notification_type= "FCM";
      notification.name = $scope.user.firstname+" ("+$scope.user.recruiterCompanyName+").";
      notification.isTyping = false;
      notification.to_id = $scope.user.userId+"";
      notification.date = formatDate+" GMT+00:00";
      notification.channel = channel+"";
      notification.chat_type="single";
      notification.media_type="text";
      notification.content_availability=true;

      var data = {};
      data.chat_obj = JSON.stringify(notification);

      var aps = {};
      if(workruitService.candidateProfile.deviceType == 'Android'){
        aps.badge= 0;
      }else{
         aps.badge= 1;
      }
      aps.content_available = 1;
      aps.sound = "bingbong.aiff";
      aps.alert = "You have a new message from "+$scope.user.firstname+" ("+$scope.user.recruiterCompanyName+").";

      notificationMessage.aps =  aps;

      notificationMessage.notification = notification;
      notificationMessage.priority = "high";
      if(workruitService.candidateProfile.deviceType == 'Android'){
        notificationMessage.to = "/topics/"+channel;
      }else{
        notificationMessage.to = workruitService.candidateProfile.regdId ;
      }

      notificationMessage.content_available = true;
      notificationMessage.data = data;

      logger.info("message",JSON.stringify(notificationMessage));

      //Save to DB
      var chatMessage = {};
      chatMessage.from_id=$scope.email;
      chatMessage.msg=localMessage;
      chatMessage.channel=channel;
      chatMessage.chat_type="single";
      chatMessage.date=formatDate+" GMT+00:00";
      chatMessage.media_type="text";
      chatMessage.source="Android";
      chatMessage.timestamp=n+"";
      chatMessage.to_id=$scope.user.userId;
      chatMessage.msg_id=n+"";
      chatMessage.name = $scope.user.firstname+" "+$scope.user.lastname;
      logger.info("Message objetc", JSON.stringify(chatMessage));

      var messages = $firebase(ref.child("channels/"+channel)).$asArray();

      messages.$add(chatMessage);

      $scope.unreadCount['workruit_v1'+workruitService.userJobs.jobPostId+workruitService.candidateProfile.userId] = 0;

      saveCount();


      $scope.newMessage="";

      //Send to devices
      var url = baseUrl + '/api/fcmPush';
      HttpClientHelper.ExecutePostMethod(url,JSON.stringify(notificationMessage)).then(function(data){

      });

    }

    //Saving count to the DB
    function saveCount(){
      console.info("Saving the count ::");

      var channel = 'workruit_v1'+workruitService.userJobs.jobPostId+workruitService.candidateProfile.userId+"_"+$scope.user.userId;
      console.log(channel);

      $firebase(ref.child(channel)).$asObject().$loaded().then(function(title) {
        var value  = title.$value == null ? 0 : title.$value  ;
        var rc = 'workruit_v1'+workruitService.userJobs.jobPostId+workruitService.candidateProfile.userId+"_"+$scope.user.userId;
        logger.info(rc)
        var rd = {};
        rd[rc] = value+1;
        ref.update(rd);

      });
    }

    ref.on('value', function(messagesSnap){
      $timeout(function() {
        var scroller = document.getElementsByClassName("chat_block")[0];
        scroller.scrollTop = scroller.scrollHeight+100;
      }, 100, false);
    });



    //Create data unread count :

    $scope.$on('unreadCallBack', function (event, data) {
        logger.info("unread callback event :::");
        console.log(data+"------"+'workruit_v1'+workruitService.userJobs.jobPostId+workruitService.candidateProfile.userId);
      var channel = 'workruit_v1'+workruitService.userJobs.jobPostId+workruitService.candidateProfile.userId;
      if(data != channel){

        logger.info($scope.unreadCount[data]);
        $scope.unreadCount[data]  = $scope.unreadCount[data] < 0 ? 0 : $scope.unreadCount[data];
        $scope.unreadCount[data] = $scope.unreadCount[data]  +1;
        logger.info($scope.unreadCount[data]);

        $scope.$apply(function(){$scope.unreadCount = $scope.unreadCount;});

      }else{
        saveCount();
      }



    })

    $scope.$watch('messages', function() {
      $timeout(function() {
        console.log("Monitoring messages "+$scope.messages.length);

        if($scope.messages.length !=0 ){
          var rc = 'workruit_v1'+workruitService.userJobs.jobPostId+workruitService.candidateProfile.userId+"_"+$scope.user.userId;
          logger.info(rc)
          var rd = {};
          rd[rc] = ($scope.messages.length);
          ref.update(rd);
        }

      }, 2000, false);

    });

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    $scope.loadFullProfile = function _loadFullProfile(profiles, jobData) {
      console.log("loadFullProfile");
      console.log("profiles: ", profiles);
      console.log("jobData: ", jobData);

      workruitService.candidateProfile = profiles;
      workruitService.userJobs = jobData;

      $location.path('applicantsProfile');
    }


  }]);
