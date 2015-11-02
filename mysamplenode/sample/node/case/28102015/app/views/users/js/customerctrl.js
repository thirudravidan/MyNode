'use strict';

apps.controller('customerCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location, AjaxMethod) {
    $scope.srch = { searchtxt: '' };
    $scope.frmsearch = {};
    $scope.frmData = {};
    $scope.data = [];
    $scope.fulldata = [];
    var data = [];
    $scope.EdtData = {};
    $scope.euserID = $routeParams.userID;
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
			AjaxMethod.postMethod('customer/'+page, $scope.frmsearch).then(function(response){
                $scope.data = [];
                var dataL = {};
                data = response;
                if(type === 'i') $scope.fulldata = data;
                $scope.data = data;
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

	$scope.viewErrDetails =function(obj) { 
		$scope.ErrDetails={};
		$scope.ErrDetails = obj;
		$('#bodyCont').html(obj.errorDetails);
    };

    $scope.createCustomer = function() {
		var insPath = 'createCustomer';
		if($scope.euserID) insPath = 'updateCustomer';
		AjaxMethod.postMethod('customer/'+insPath, $scope.frmData).then(function(response){
			if(response) {
				successMsg('Update Customer', 'Customer updated successfully');
				$('#frmCustomerEdit').data('bootstrapValidator').resetForm();
				$scope.frmData = {};
				$location.path('/customer/customerList');
			} else {
				successMsg('Create Customer', 'Customer created successfully');
				$('#frmCustomerReg').data('bootstrapValidator').resetForm();
				$scope.frmData = {}; // clear the form so our user is ready to enter another
			}
		});
				
	};

	$scope.editCustomer = function() { 
		if($scope.euserID) {
			$scope.editUsr = {};
			$scope.editUsr.id = $scope.euserID;
			AjaxMethod.postMethod('customer/getcustomerByID', $scope.editUsr).then(function(response){
					var usrRes = response; 
					//$scope.frmData.id = usrRes._id;
					$scope.frmData.firstName = usrRes.firstName;
					$scope.frmData.lastName = usrRes.lastName;
					$scope.frmData.primaryphone = usrRes.primaryphone;
					$scope.frmData.Email = usrRes.Email;
					$scope.frmData.company = usrRes.company;
					$scope.frmData.city = usrRes.city;
					$scope.frmData.country = usrRes.country;
					$scope.frmData.state = usrRes.state;
					$scope.frmData.addressline1 = usrRes.addressline1;
					$scope.frmData.addressline2 = usrRes.addressline2;
					$scope.frmData.zip = usrRes.zip;
					angular.copy($scope.frmData, $scope.EdtData); 
			});
		}
	};
})
.controller('customerViewCtrl', function($rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location, AjaxMethod){

	$scope.frmsearch = {};
	$scope.data = {};
	$scope.frmData = {};
	$scope.EdtData = {};
	var data = [];
	$scope.euserID = $routeParams.userID;
	$scope.viewCustomer = function() { 
		if($scope.euserID) {
			$scope.editUsr = {};
			$scope.editUsr.id = $scope.euserID;
			AjaxMethod.postMethod('customer/getcustomerByID', $scope.editUsr).then(function(response){
					var usrRes = response; 
					$scope.frmData.id = usrRes._id;
					$scope.frmData.custname = usrRes.firstName + ' ' + usrRes.lastName;
					$scope.frmData.phoneno = usrRes.primaryphone;
					$scope.frmData.Email = usrRes.Email;
					$scope.frmData.country = usrRes.country;
			});
		}
	};

    $scope.srch = { searchtxt: '' };
    $scope.data = [];
    $scope.fulldata = [];
    $scope.dataInit = function (page,type) {
    	AjaxMethod.postMethod('category/getCatlist').then(function(response){
		    $scope.dropdownList = response.category;
		    $rootScope.dropdownList = response.category;
		});
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
            $scope.frmsearch.custId = $scope.euserID;
            AjaxMethod.postMethod('case/'+page, $scope.frmsearch).then(function(response){
                $scope.data = [];
                var dataL = {};
                data = response;
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

    $scope.getCatListValue = function(value, key){
        if(value) {
            if (angular.isNumber(value) && key !== 'caseId') {
                if($scope.dropdownList) {
                    $scope.showCatValue = alasql('SELECT _id as id, name as label FROM ? WHERE status=1 and _id='+value, [$scope.dropdownList]);
                    if($scope.showCatValue)
                        value = $scope.showCatValue[0].label;
                } else {
                    value = value;    
                }
            } else {
                value = value;
            }
        }
        return value;
    };    

    $scope.getData = function(value) {
        return value.replace(/[\s]/g,'');
    };

    $scope.showFields = function (value) {
        var returnRes = false;
        switch(value) {
            case '_id':
                returnRes = true;
                break;
            case 'Email Response':
                returnRes = true;
                break;
            case 'Case Notes':
                returnRes = true;
                break;
            case 'Subject Header Suffix':
                returnRes = true;
                break;
            case 'Schedule Callback':
                returnRes = true;
                break;
            case 'Request Type':
                returnRes = true;
                break;
            case 'customerId':
                returnRes = true;
                break;
            case 'Email Template':
                returnRes = true;
                break;
            case 'Callback Number':
                returnRes = true;
                break;
            case 'Reason For Callback':
                returnRes = true;
                break;
            case 'From DateTime':
                returnRes = true;
                break;
            case 'To DateTime':
                returnRes = true;
                break;
            case 'Callback Owner':
                returnRes = true;
                break;
        }
        return returnRes;
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
});

function successMsg(title,msg) {
	BootstrapDialog.show({
	    type: BootstrapDialog.TYPE_SUCCESS,
	    title: title,
	    message: msg,
	    buttons: [{
	        label: 'Close',
	        action: function(dialogItself){
	            dialogItself.close();
	        }
	    }]
	});  
}
