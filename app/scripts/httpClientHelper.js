var workruitApp = angular.module('workruitUiApp');

  workruitApp.factory('HttpClientHelper', ['$http','logger','$cookieStore','$location','$rootScope','$crypto','$base64',
    function($http,logger,$cookieStore,$location,$rootScope,$crypto,$base64){


    var service = {};
    service.ExecutePostMethod = ExecutePostMethod;
    service.ExecuteGetMethod = ExecuteGetMethod;
    service.ExecutePutMethod = ExecutePutMethod;
    service.ExecuteDeleteMethod = ExecuteDeleteMethod;

    return service;

    /**
     * To make the post calls to the server
     * @param url
     * @param context
     * @returns {*}
     * @constructor
     */
    function ExecutePostMethod(url,context) {
      logger.info("ExecutePostMethod start");
      logger.info("Url requesting is ",url);
      setHeader();
      var encrypted = $crypto.encrypt(context, (localStorage.getItem("sessionId")== null) ? "password" : localStorage.getItem("sessionId"));
      logger.info(encrypted);
      if(url.indexOf("uploadCompanyLogo") > -1){
        return $http.post(url, context).then(handleSuccess, handleError);
      }

      if(url.indexOf("fcmPush") > -1){
        return $http.post(url, encrypted, {ignoreLoadingBar: true}).then(handleSuccess, handleError);
      }else{
        return $http.post(url, encrypted).then(handleSuccess, handleError);
      }


    }

    /**
     * To make the get calls to the server
     * @param url
     * @returns {*}
     * @constructor
     */
    function ExecuteGetMethod(url) {
      logger.info("ExecuteGetMethod start");
      logger.info("Url requesting is ",url);
      setHeader();
      return $http.get(url).then(handleSuccess, handleError);
    }

    /**
     * To make the put calls to the server
     * @param url
     * @param user
     * @returns {*}
     * @constructor
     */
    function ExecutePutMethod(url,context) {
      logger.info("ExecutePutMethod start");
      logger.info("Url requesting is ",url);
      setHeader();
      return $http.put(url, context).then(handleSuccess, handleError);
    }

    /**
     * To make the Delete calls to the server
     * @param url
     * @returns {*}
     * @constructor
     */
    function ExecuteDeleteMethod(url) {
      logger.info("ExecuteDeleteMethod start");
      logger.info("Url requesting is ",url);
      setHeader();
      return $http.delete(url).then(handleSuccess, handleError);
    }

    function setHeader(){
        $http.defaults.headers.common['Token'] = localStorage.getItem("sessionId");
        $http.defaults.transformResponse = undefined;
        var auth = $base64.encode("admin:workruit$");
        $http.defaults.headers.common['Authorization'] = 'Basic ' + auth;
    }
    // private functions, These functions helps to send the response to the service layer

    function handleSuccess(data) {
      //logger.info("Success Message :: ",data.data);
      if(JSON.stringify(data).indexOf("httpPath") > -1){
        return JSON.parse(data.data);
      }

      var decrypted = $crypto.decrypt(data.data, (localStorage.getItem("sessionId")== null) ? "password" : localStorage.getItem("sessionId"));
     // logger.info(decrypted);
      return JSON.parse(decrypted);

    }

    function handleError(data) {
      logger.error("Failure Message :: ",data,data.status);
      if(data.status ==403){
    	  logger.error("User has no proper permissions");
    	  $location.path('/');
    	  throw { success: false, message: "User Access Expired. Please login and Proceed..", code :403 };
      }
      logger.info("data "+data.data);
      //data.data is undefined sometimes, check for it
      if(data.data && data.data.meta){
    	  if (data.data.meta.code == 500){
    		  throw { success: false, message: "System has facing some problems with this request. Please check your request or it could be a server error.", code :data.data.meta.code  };
    	  }else{
    		  throw { success: false, message: data.data.response, code :data.data.meta.code  };
    	  }
      }

      throw { success: false, message: "Unable to contact the server. We are working hard to fix it", code :0 };
    }

}]);
