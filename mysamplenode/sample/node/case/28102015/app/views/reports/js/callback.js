'use strict';

apps
.controller('callbackcaseController', ['$scope', '$rootScope', '$builder', '$validator', 'AjaxMethod', 'ngTableParams', '$routeParams', '$filter', function($scope, $rootScope, $builder, $validator, AjaxMethod, ngTableParams, $routeParams, $filter) {
     
    $scope.srch = { searchtxt: '' };
    $scope.data = [];
    $scope.fulldata = [];
    var data = [];
    $scope.dataInit = function (page,type) { 
        //$scope.loading = true;
        if(type === 'c') {
            $scope.frmsearch = {};
            data = $scope.fulldata;
            $scope.data = $scope.fulldata;
            $scope.clearData();
            $scope.tableParams.reload();
        } else if(type === 's') {
            $scope.frmsearch = {};
            data = $scope.fulldata;
            $scope.data = $scope.fulldata;
            $scope.searchData();
            $scope.tableParams.reload();
        } else { 
            $scope.srch.searchtxt = '';
            AjaxMethod.postMethod('callback/'+page, {}).then(function(response){
                $scope.data = [];
                var dataL = {};
                data = response;
                console.dir(data);
                if(type === 'i') $scope.fulldata = data;
                $scope.data = data;
                $scope.colsName = {};
                angular.forEach(data[0], function (value, key) {
                    $scope.colsName[$scope.getData(key)] = key;
                });
                $scope.tableParams.reload();
            });
        }  
    };

    /* jshint ignore:start */
    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        filter: $scope.srch.searchtxt // Filter Text
    }, {
        counts: [],
        total: $scope.data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                    $filter('orderBy')($scope.data, params.orderBy()) :
                    $scope.data;
            orderedData = params.filter() ?
                    $filter('filter')(orderedData, params.filter()) :
                    orderedData;
            params.total(orderedData.length);
            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            //$scope.loading = false;
        }
    });
    /* jshint ignore:end */
    
    $scope.searchData = function () {
        //$scope.loading = true;
        var filter = $scope.srch.searchtxt;
        $scope.tableParams.filter(filter, $scope.data);

    };

    $scope.clearData = function(){
        $scope.srch.searchtxt = '';
        $scope.searchData();
    };

     $scope.getData = function(value) {
        return value.replace(/[\s]/g,'');
    }; 

    $scope.getCallbackListValue = function(value, key){  
        /*if(value) { 
                if($scope.dropdownList) { 
                    $scope.showCatValue = alasql('SELECT _id as id, name as label FROM ? WHERE _id='+value, [$scope.dropdownList]);
                    value = $scope.showCatValue[0].label;
                } else {
                    value = value;    
                } 
        }*/
        return value;
    };

}]);
