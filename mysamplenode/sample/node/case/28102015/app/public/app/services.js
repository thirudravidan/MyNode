'use strict';

apps.factory('AjaxMethod', ['$http', function($http){
	var urlBase = 'http://10.20.28.29:8091/caseTracker/';
    return {
        callmethod: function(){
            alert('haide');
        },
        getMethod: function (method, parameter) {
            var result = $http.get(urlBase + method, parameter)
            .then(function (response) {
                return response.data;
            });
            return result;
        },
        postMethod: function (method, parameter) {
            var result = $http.post(urlBase + method, parameter)
            .then(function (response) {
                return response.data;
            });
            return result;
        }
    };
}]);