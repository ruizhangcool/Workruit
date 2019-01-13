(function() {
    'use strict';

    angular
        .module('utils.logger')
        .factory('logger', logger);

    logger.$inject = ['$log'];

    function logger($log, toastr) {
        var service = {
            showToasts: true,
            showLog : true,
            error   : error,
            info    : info,
            success : success,
            warning : warning,

            // straight to console; bypass toastr
            log     : $log.log
        };

        return service;
        /////////////////////

        function error(message, data, title) {
          //  toastr.error(message, title);
          if(service.showLog) {
            $log.error('Error: ' + message, data);
          }
        }

        function info(message, data, title) {
          //  toastr.info(message, title);
          if(service.showLog) {
            $log.info('Info: ' + message, data);
          }
        }

        function success(message, data, title) {
           // toastr.success(message, title);
          if(service.showLog) {
            $log.info('Success: ' + message, data);
          }
        }

        function warning(message, data, title) {
           // toastr.warning(message, title);
          if(service.showLog) {
            $log.warn('Warning: ' + message, data);
          }
        }
    }
}());
