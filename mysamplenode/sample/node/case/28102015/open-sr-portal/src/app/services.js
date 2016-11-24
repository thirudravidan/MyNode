apps.factory('AjaxMethod', function($http, $rootScope,$cookies){
	var urlBase = 'caseTracker/';
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
        },
        getCategoryList: function () {
            return $rootScope.catgoryList;
        },
        collapseToggle: function (className) {
            $('.'+className).collapse('toggle');
        },
        getPageLevelACl: function (){
            var menuACl=$cookies.get('selectedMenuACL');
            switch(parseInt(menuACl,10)) {
                case 3: 
                    $rootScope.isAddButtonEnabled =true;
                    $rootScope.isEditButtonEnabled =false;
                    $rootScope.isSaveButtonEnabled =true;
                    break;
                case 4 :
                    $rootScope.isAddButtonEnabled =false;
                    $rootScope.isEditButtonEnabled =false;
                    $rootScope.isSaveButtonEnabled =false;
                    break;
                default :
                    $rootScope.isAddButtonEnabled =true;
                    $rootScope.isEditButtonEnabled =true;
                    $rootScope.isSaveButtonEnabled =true;
                    break;
            }
        },
        getArrayIndexForKey: function(arr, key, val){
            for(var i = 0; i < arr.length; i++){
                if(arr[i][key] === val) {
                    return i;
                }
            }
            return -1;
        }
    };
});
