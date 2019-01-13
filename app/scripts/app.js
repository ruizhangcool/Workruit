'use strict';

/**
 * @ngdoc overview
 * @name workruitUiApp
 * @description
 * # workruitUiApp
 *
 * Main module of the application.
 */


var baseUrl = "https://stagesecureapi.workruit.com/";


var workruitApp =  angular
  .module('workruitUiApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngTagsInput',
    'ngAria',
    'angular-loading-bar',
    'autocomplete',
    'validation',
    'validation.rule',
    'angularjs-dropdown-multiselect',
    'ngImgCrop',
    'toaster',
    'rzModule',
    'ui.toggle',
    'angular.chips',
    'ngMaterial',
    'firebase',
    'mdo-angular-cryptography',
    'utils.logger',
    'base64',
    'ngToast'
  ]);

workruitApp .config(function($routeProvider,cfpLoadingBarProvider,$validationProvider,$cryptoProvider,$base64,ngToastProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 500;
  $validationProvider.showSuccessMessage = false;
  $cryptoProvider.setCryptographyKey('password');

  ngToastProvider.configure({
    animation: 'slide' // or 'fade'
  });


  // Setup `ip` validation
  var expression = {
    link: /(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.|.org]+(\[\?%&=]*)?/
  };

  var validMsg = {
    link: {
      error: 'Website url is not formatted properly',
      success: 'It\'s url'
    }
  };

  $validationProvider.setExpression(expression) // set expression
    .setDefaultMsg(validMsg); // set valid message



  $validationProvider.setDefaultMsg({
    required: {
      error: 'This field is required.'
    }
  });

  $routeProvider
      // route for the home page
      .when('/', {
        templateUrl : 'views/login.html',
        controller  : 'loginController'
      })

      .when('/signup', {
        templateUrl : 'views/signup.html',
        controller  : 'signupController',
        resolve: {
          /*pageData: function ($http, $route) {
            return $http({
              method: 'GET',
              headers: {
                'Token': "94b51cc4-0c99-11e7-93ae-92361f002671"
              },
              url: baseUrl + 'api/masterData',
              transformResponse: undefined
            }).then(function successCallback(response) {
              console.log("Dummy call to hold the data");
            }, function errorCallback(response) {

            });
          }*/
          pageData: ['$http', '$route','$crypto','logger',function ($http, $route,$crypto,logger) {
          return $http({
              method: 'GET',
              headers: {
                'Token': "94b51cc4-0c99-11e7-93ae-92361f002671"
              },
              url: baseUrl + 'api/masterData',
              transformResponse: undefined
            }).then(function successCallback(response) {
            if (response.status === 200) {
              logger.info(response);
              var decrypted = $crypto.decrypt(response.data);
              logger.info(decrypted);
              decrypted = JSON.parse(decrypted);
              logger.info(decrypted);
              localStorage.setItem("masterData",JSON.stringify(decrypted));

            }
            }, function errorCallback(response) {

            });
          }]
        }

      })

      .when('/emailVerification', {
        templateUrl : 'views/emailVerification.html',
        controller  : ''
      })

      .when('/unsubscribe', {
        templateUrl : 'views/unsubscribe.html',
        controller  : ''
      })

      .when('/messages', {
        templateUrl : 'views/messages.html',
        controller  : 'chatController'
      })


    .when('/manageProfile', {
        templateUrl : 'views/manageProfile.html',
        controller  : 'manageProfileController'
      })

      .when('/manageProfilePro', {
        templateUrl : 'views/manageProfileGeneral.html',
        controller  : 'manageProfileGeneralController'
      })

      .when('/manageProfileGeneral', {
        templateUrl : 'views/manageProfileGeneral.html',
        controller  : 'manageProfileController'
      })

      .when('/verifyemail', {
        templateUrl : 'views/emailVerification.html',
        controller  : ''
      })

      .when('/company/:companyName/:userId', {
        templateUrl : 'views/about_company.html',
        controller  : 'companyController'
      })

      .when('/editCompany', {
        templateUrl : 'views/edit_company.html',
        controller  : 'editCompanyController'
      })

      .when('/viewCompany', {
        templateUrl : 'views/view_company_profile.html',
        controller  : 'viewCompanyController'
      })

      /*	.when('/viewProfile', {
       templateUrl : 'pages/view_profile.html',
       controller  : 'signupController'
       })*/

      .when('/viewProfile', {
        templateUrl : 'views/view_profile.html',
        controller  : 'viewProfileController'
      })

      .when('/editProfile', {
        templateUrl : 'views/editProfile.html',
        controller  : 'editProfileController'
      })

      .when('/resetPasswd', {
        templateUrl : 'views/resetPassword.html',
        controller  : 'resetPasswordController'
      })

      .when('/welcome', {
        templateUrl : 'views/welcome.html',
        controller  : ''
      })

      .when('/postjob', {
        templateUrl : 'views/postjob.html',
        controller  : 'jobController'
      })

      /*	.when('/editPostjob', {
       templateUrl : 'pages/postjob.html',
       controller  : 'jobController'
       })*/

      .when('/editPostjob', {
        templateUrl : 'views/editjob.html',
        controller  : 'jobController'
      })

      .when('/closePostjob', {
        templateUrl : 'views/closejob.html',
        controller  : 'jobController'
      })

      .when('/resetpwd', {
        templateUrl : 'views/forgotpwd.html',
        controller  : 'resetPasswordController'
      })
      .when('/resetPasswordNew/:userId', {
        templateUrl : 'views/resetPasswordNew.html',
        controller  : 'resetPasswordController'
      })
    .when('/createPasswordNew/:userId', {
      templateUrl : 'views/createPasswordNew.html',
      controller  : 'resetPasswordController'
    })
      .when('/activity', {
        templateUrl : 'views/activity.html',
        controller  : 'activityController'
      })

      .when('/applicants', {
        templateUrl : 'views/candidates.html',
        controller  : 'candidatesController'
      })
      .when('/applicantsProfile', {
        templateUrl : 'views/candidatesProfile.html',
        controller  : 'activityController'
      })
      .when('/applicantsCardProfile', {
        templateUrl : 'views/candidatesCardProfile.html',
        controller : 'candidateCardController'
      })
      .when('/applicantsInterestedProfile', {
        templateUrl : 'views/candidatesInterestedProfile.html',
        controller  : 'activityController'
      })

      .when('/jobs', {
        templateUrl : 'views/jobs.html',
        controller  : 'jobDetailsController'
      })

      .when('/jobsuccess', {
        templateUrl : 'views/jobVerification.html',
        controller  : ''
      })

      .when('/pending', {
        templateUrl : 'views/job_pending.html',
        controller  : 'jobDetailsController'
      })

      .when('/closed', {
        templateUrl : 'views/job_closed.html',
        controller  : 'jobDetailsController'
      })

      // route for the contact page
      .when('/contact', {
        templateUrl : 'views/contact.html',
        controller  : 'contactController'
      })

     .when('/settings', {
        templateUrl : 'views/settings.html',
        controller  : 'settingsController'
      })

    .when('/chat', {
      templateUrl : 'views/chat_message.html',
      controller  : 'chatController'
    })
   /* .otherwise({
      templateUrl: 'views/pagenotfound.html',
      controller: ''
    })*/
    .otherwise({ redirectTo: '/' });

  }).run(run);

run.$inject = ['$rootScope', '$location'];
function run($rootScope, $location) {

  $rootScope.$on('$locationChangeStart', function (event, next, current) {
    var pages =['signup','resetpwd','resetPasswordNew','verifyemail','createPasswordNew','unsubscribe','manageProfile','manageProfilePro'];
    var location = ($location.path()).split("/");
    var restrictedPage = $.inArray(location[1], pages) === -1;
    var loggedIn = false;
    //logger.info("login check -----");
    var userId = localStorage.getItem("userId");
    if(userId){
     // logger.info("login userId check");
        loggedIn = true;
    }
     // logger.info("loggedIn "+loggedIn+" restrictedPage "+restrictedPage+" $location.path() "+location[1]);
      if ((!loggedIn && restrictedPage)) {
        $location.path("/");
      }
  });
};


// Create the factory that share the Fact
workruitApp.factory('messageFactory', function(){
  var data = {
    error: false,
    success: false
  };

  return {
    getError: function () {
      return data.error;
    },
    setError: function (error) {
      data.error = error;
    },
    getSuccess: function () {
      return data.success;
    },
    setSuccess: function (success) {
      data.success = success;
    }
  };
});


// create the controller and inject Angular's $scope

workruitApp.controller('mainController',['$scope', '$http', 'workruitService', '$location','messageFactory','toaster','$timeout','$crypto','logger','$rootScope','ngToast',
  function($scope, $http, workruitService, $location,messageFactory,toaster,$timeout,$crypto,logger,$rootScope,ngToast) {

  $scope.nav = {};
  $scope.nav.navBar = false;
  $scope.nav.activeTab = $location.path();
  $scope.errorMessage = "";
  $scope.message = "";
  $scope.masterData = {};
  $scope.payload = {};
  $scope.imageUrl = "https://stageimages.workruit.com/resources/";
  localStorage.setItem("imageUrl",$scope.imageUrl);

  $scope.payload = {};

  $scope.user =  JSON.parse(localStorage.getItem("userData"));
  /*ngToast.create({
    className: 'success',
    content: '<b>success!</b> This a success message.',
    dismissOnTimeout: true,
    dismissButton: true,
    animation:'slide'
  });
  ngToast.create({
    className: 'info',
    content: '<b>Info!</b> This a info message.',
    dismissOnTimeout: true,
    dismissButton: true,
    animation:'slide'
  });
  ngToast.create({
    className: 'warning',
    content: '<b>Info!</b> This a warning message.',
    dismissOnTimeout: true,
    dismissButton: true,
    animation:'slide'
  });*/



  //$scope.userData = {};



  ///////////////////////////////     Firebase start //////////////////


  var config = {
    apiKey: "AIzaSyAXQhrkpagbroAzfnGu0Kz_jvxVqVYAfIU",
    authDomain: "workruit-f6542.firebaseapp.com",
    databaseURL: "https://workruit-f6542.firebaseio.com",
    projectId: "workruit-f6542",
    storageBucket: "workruit-f6542.appspot.com",
    messagingSenderId: "359675688873"
  };
  var appConfigObject = firebase.initializeApp(config);
  logger.info(appConfigObject);

  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();

  // IDs of divs that display Instance ID token UI or request permission UI.
  const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';
  // [START refresh_token]
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {
    messaging.getToken()
      .then(function(refreshedToken) {
        logger.info('Token refreshed.');
        // Indicate that the new Instance ID token has not yet been sent to the
        // app server.
        setTokenSentToServer(false);
        // Send Instance ID token to app server.
        sendTokenToServer(refreshedToken);
        // [START_EXCLUDE]
        // Display new Instance ID token and clear UI of all previous messages.
        resetUI();
        // [END_EXCLUDE]
      })
      .catch(function(err) {
        logger.info('Unable to retrieve refreshed token ', err);
        showToken('Unable to retrieve refreshed token ', err);
      });
  });


  // [END refresh_token]
  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a sevice worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {

    logger.info("Message received. ", payload);

    logger.info(payload.notification.title);
    $scope.user =  JSON.parse(localStorage.getItem("userData"));

    var chat_object = null;
    var chat_object_String = null;
    if(payload.data!=null && payload.data!= undefined){
      chat_object_String =  payload.data.chat_obj;
    }
    if(chat_object_String!=null && chat_object_String != undefined){
      chat_object = JSON.parse(chat_object_String);
    }
    logger.info("Chat object :",chat_object);
    if(payload.notification.title === 'Notif_Recruiter_JobMatch'){
       logger.info("Triggering modal");
      $scope.payload = payload;
      logger.info($scope.payload.data.applicant_last_name);
      $timeout(function () {
        document.getElementById("openModalButton").click();
      }, 3000);
    }else if(chat_object==null || chat_object== undefined ){

      /*$timeout(function () {
        toaster.pop({ type: 'info', body: 'bind-unsafe-html', bodyOutputType: 'directive', directiveData: payload  });
      }, 3000);*/
     logger.info(payload);
     var content = "<a href="+payload.notification.click_action+">"+payload.notification.body+"</a>";
     var clsNm ="success";
     logger.info(payload.notification.body);
     logger.info(payload.notification.body.search('closed'));
     logger.info(payload.notification.body.search('rejected'));
     if(payload.notification.body.search('closed') > 0 || payload.notification.body.search('rejected') > 0)
        clsNm ="danger";

     createNotify("New Match", content);
      /*
      ngToast.create({
        className: clsNm,
        content: content,
        dismissButton: true
      });
      */
     $scope.$apply();
    } else if(chat_object!=null && chat_object!= undefined  && !chat_object.isTyping && chat_object.msg.length >0 && $scope.nav.activeTab != '/messages' && $scope.user.email !==chat_object.from_id){

      localStorage.setItem("chatMessageObject",chat_object.channel);
      payload.notification.click_action = "#messages";
      /*$timeout(function () {
        toaster.pop({ type: 'info', body: 'chat-unsafe-html', bodyOutputType: 'directive', directiveData: payload  });
      }, 3000);*/
       //logger.info(payload);
      var content = "<a href="+payload.notification.click_action+">"+payload.notification.body+"</a>";
      createNotify("New Match", content);

      // var msgTst =  ngToast.create({
      //     className: 'success',
      //     content: content,
      //     dismissButton: true
      //   });
      $scope.$apply();

    } else if(chat_object!=null && chat_object!= undefined  && !chat_object.isTyping && chat_object.msg.length >0 && $scope.user.email !==chat_object.from_id ){
     //Update unread count
          console.log(chat_object.channel +" here I need to add one to the existing count");
          $rootScope.$broadcast('unreadCallBack',chat_object.channel);
    } else{
       logger.info(payload);
    }

    // Update the UI to include the received message.
    //appendMessage(payload);
    // [END_EXCLUDE]
  });
  // [END receive_message]
  function resetUI() {
    messaging.getToken()
      .then(function(currentToken) {
        if (currentToken) {
          logger.info(currentToken);

          sendTokenToServer(currentToken);
          updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          logger.info('No Instance ID token available. Request permission to generate one.');
          setTokenSentToServer(false);
        }
      })
      .catch(function(err) {
        logger.info('An error occurred while retrieving token. ', err);
        setTokenSentToServer(false);
      });
  }
  // [END get_token]
  function showToken(currentToken) {
    // Show token in console and UI.
    var tokenElement = document.querySelector('#token');
    //tokenElement.textContent = currentToken;
  }
  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer()) {
      logger.info('Sending token to server...');
      window.localStorage.setItem("fcm_token",currentToken);
      setTokenSentToServer(true);
    } else {
      logger.info('Token already sent to server so won\'t send it again ' +
      'unless it changes');
    }


  }
  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
  }
  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
  }
  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      // div.style = "display: visible";
    } else {
      // div.style = "display: none";
    }
  }
  function requestPermission() {
    logger.info('Requesting permission...');

    try {
      // [START request_permission]
      messaging.requestPermission()
        .then(function() {
          logger.info('Notification permission granted.');
          resetUI();
        })
        .catch(function(err) {
          logger.info('Unable to get permission to notify.', err);
        });
      // [END request_permission]
    }
    catch(err) {
      logger.info("Exception in getting token :", err);
    }

  }
  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken()
      .then(function(currentToken) {
        messaging.deleteToken(currentToken)
          .then(function() {
            logger.info('Token deleted.');
            setTokenSentToServer(false);
            // [START_EXCLUDE]
            // Once token is deleted update UI.
            resetUI();
            // [END_EXCLUDE]
          })
          .catch(function(err) {
            logger.info('Unable to delete token. ', err);
          });
        // [END delete_token]
      })
      .catch(function(err) {
        logger.info('Error retrieving Instance ID token. ', err);
        showToken('Error retrieving Instance ID token. ', err);
      });
  }
  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    logger.info(messagesElement);
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;'
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    //messagesElement.appendChild(dataHeaderELement);
    //messagesElement.appendChild(dataElement);
  }
  // Clear the messages element of all children.
  function clearMessages() {
    const messagesElement = document.querySelector('#messages');
    //while (messagesElement.hasChildNodes()) {
    //messagesElement.removeChild(messagesElement.lastChild);
    // }
  }
  function updateUIForPushEnabled(currentToken) {
    showHideDiv(tokenDivId, true);
    showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }
  function updateUIForPushPermissionRequired() {
    showHideDiv(tokenDivId, false);
    showHideDiv(permissionDivId, true);
  }
  requestPermission();

  ///////////////////////////////// Firebase stop

  $scope.$on('$viewContentLoaded', function(){
    //Here your view content is fully loaded !!
    $scope.nav.activeTab = $location.path();
    var imagePath = localStorage.getItem("companyImage");
    if(imagePath == null  || imagePath == "null" || imagePath === 'undefined' || imagePath.length == 0){
      imagePath = "images/img_com_1x.png";
    }else{
      imagePath = $scope.imageUrl+imagePath;
    }

    $scope.companyPicture =  imagePath;
  });


  $scope.showToast = function(payload){

    logger.info("Contoller method....."+JSON.stringify(payload)+"--");


    logger.info("loading");

  }


  $scope.masterDataMethod = function(){
    $http({
      method: 'GET',
      headers: {
        'Token': "94b51cc4-0c99-11e7-93ae-92361f002671"
      },
      url: baseUrl + 'api/masterData',
      transformResponse: undefined
    }).then(function successCallback(response) {
      if (response.status === 200) {
        logger.info(response);
        var decrypted = $crypto.decrypt(response.data);
        logger.info(decrypted);
        decrypted = JSON.parse(decrypted);
        logger.info(decrypted);
        $scope.masterData = decrypted;
        localStorage.setItem("masterData",JSON.stringify(decrypted));

      } else {
        $scope.errorMessage = response.data.msg.description;
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });
  }

  $scope.masterDataMethod();


  $scope.closeModal= function(){
    logger.info("close modal called"+messageFactory.getSuccess());
    $scope.error=false;
    $scope.success=false;
    messageFactory.setError(false);
    messageFactory.setSuccess(false);
  }

    $scope.localMessage = function _loadFullProfile(email) {
      console.log("loadSendMessage ------- ");
      workruitService.email = email;
      $location.path('messages');
    }


  $scope.logout = function() {

    var userId = "";
    if ($scope.userdata === undefined){
      userId = localStorage.getItem("userId");
    }
    else {
      userId = $scope.userdata.userId;
    }


    var sessionId = localStorage.getItem("sessionId");

    $http({
      method: 'GET',
      headers: {
        'Token': localStorage.getItem("sessionId")
      },
      transformResponse: undefined,
      ///user/{userId}/{sessionId}/dashboardLogout
      url: baseUrl + 'api/user/'+userId+'/'+sessionId+'/dashboardLogout'
    }).then(function successCallback(response) {
      if (response.status === 200) {
       // var decrypted = $crypto.decrypt(response.data);

        logger.info("Dashboard logout success 200 OK");
        workruitService.userdata = {};
        $scope.nav.navBar = false;
        //Before logout remove localStorage Values
        localStorage.removeItem("userId");
        localStorage.removeItem("sessionId");
        localStorage.removeItem("companyImage");
        localStorage.removeItem("userData");
        localStorage.removeItem("activeLength");
        localStorage.removeItem("closeJobId");
        localStorage.removeItem("closedLength");
        localStorage.removeItem("pendingLength");
        localStorage.removeItem("editJobId")

        $location.path( '/');
      } else {
        $scope.errorMessage = response.data.msg.description;
      }
    }, function errorCallback(response) {
      localStorage.removeItem("userId");
      localStorage.removeItem("sessionId");
      localStorage.removeItem("companyImage");
      localStorage.removeItem("userData");
      localStorage.removeItem("activeLength");
      localStorage.removeItem("closeJobId");
      localStorage.removeItem("closedLength");
      localStorage.removeItem("pendingLength");
      localStorage.removeItem("editJobId");
      $location.path( '/');
    });
  }
}]);

workruitApp.filter('workruitDate', function(){
  return function(input, char){
    var date = input.split(" ");
    return date[0]+" "+date[2];

  }
});

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

workruitApp.filter('workruitChatDate', function(){
  return function(input, char){
   // console.log(input);
    var date = new Date(input);

    var lastDate =  new Date(localStorage.getItem("lastChatDate"));
    //console.log(date);
     var today = new Date();
    if(today.toLocaleDateString() == date.toLocaleDateString()){
        console.log(date.getTime() +"--------"+lastDate.getTime());
          if((date.getTime() - lastDate.getTime()) > 300000 ){
            localStorage.setItem("lastChatDate",input);
            return formatAMPM(date).toUpperCase();
          }
          localStorage.setItem("lastChatDate",input);

    }else{
      console.log(date.getMinutes() +"--------"+lastDate.getMinutes());
      if((date.getTime() - lastDate.getTime()) > 300000 || localStorage.getItem("lastChatDate") == null) {
        localStorage.setItem("lastChatDate",input);
        return (monthNames[date.getMonth()] + " " + date.getDate() + ", " + formatAMPM(date)).toUpperCase();
      }
      localStorage.setItem("lastChatDate",input);
    }

  }
});

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + '' + ampm;
  return strTime;
}



workruitApp.directive('ngEnter', function() {
    return function(scope, element, attrs) {
      element.bind("keypress", function(e) {
        if(e.which === 13) {
          scope.$apply(function(){
            scope.$eval(attrs.ngEnter, {'e': e});
          });
          e.preventDefault();
        }
      });
    };
  });


workruitApp.directive('bindUnsafeHtml', [function () {
  return {
    template: "<a href='{{directiveData.notification.click_action}}'>{{directiveData.notification.body}}</a>"
  };
}])

workruitApp.directive('chatUnsafeHtml', [function () {

  return {
    template: "<a href='{{directiveData.notification.click_action}}'>{{directiveData.notification.body}}</a>"
  };
}])



