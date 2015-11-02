'use strict';

apps.controller('userCtrl', function ($rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location) {
	$scope.frmsearch = {};
	$scope.data = {};
	$scope.frmData = {};
	$scope.EdtData = {};
	var data = [];
	$scope.euserID = $routeParams.userID; 
	$scope.Datainit = function (page,type) {
		var dataL = {};
		if(type === 'c') {
			$scope.frmsearch = {};
			$scope.searchtxt = '';
		} else if(type === 's') {
			$scope.frmsearch = {};
		} else {
			$scope.searchtxt = '';
		}
		$scope.listPromise = $.post('caseTracker/user/'+page, $scope.frmsearch).success(function(response) {
			var data = response;
			$scope.data = data;
			console.log($scope.data);
			$('#norecords').hide();
			if($scope.data.length === 0)
				$('#norecords').show();
			$scope.tableParams.reload();
		});
	};

    /* jshint ignore:start */
	$scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 10, // count per page
		filter: $scope.searchtxt // Filter Text
    }, {
        counts: [],
        total: $scope.data.length, // length of data
        getData: function ($defer, params) {
			var filteredData = $scope.searchtxt ?
					$filter('filter')($scope.data, $scope.searchtxt) :
					$scope.data;
			var orderedData = params.sorting() ?
					$filter('orderBy')(filteredData, params.orderBy()) :
					$scope.data;
			$('#norecords').hide();
			if(orderedData.length === 0)
				$('#norecords').show();				
			params.total(orderedData.length); // set total for recalc pagination
			$scope.fdata = orderedData;
			$defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });
    /* jshint ignore:end */
    $scope.$watch('searchtxt', function () {
		$scope.tableParams.reload();
	});

	$scope.clearData = function(){
		$scope.searchtxt = '';
	};
	
	$scope.viewErrDetails =function(obj) { 
		$scope.ErrDetails={};
		$scope.ErrDetails = obj;
		$('#bodyCont').html(obj.errorDetails);
		console.log($scope.ErrDetails);
    };

    $scope.createUser = function() {
		var insPath = 'createUser';
		if($scope.euserID) insPath = 'updateUser';
		$http.post('caseTracker/user/'+insPath, $scope.frmData)
			.success(function(data) { 
				if (data.errorMessage !== null) {
					$scope.frmData = {}; // clear the form so our user is ready to enter another
				} else {
					if($scope.euserID) {
						successMsg('Update User', 'User updated successfully');
						$('#frmUserEdit').data('bootstrapValidator').resetForm();
						$scope.frmData = {};
						$location.path('/userlist');
					} else {
						successMsg('Create User', 'User created successfully');
						$('#frmUserReg').data('bootstrapValidator').resetForm();
						$scope.frmData = {}; // clear the form so our user is ready to enter another
					}
					
				} 
				if(data.errorMessage === '')
					$scope.frmData = {}; // clear the form so our user is ready to enter another
					//location.reload(true);
				else 
					console.log(data.errorMessage);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.editUser = function() { 
		if($scope.euserID) {
			$scope.editUsr = {};
			$scope.editUsr.id = $scope.euserID;
			$http.post('caseTracker/user/getuserByID', $scope.editUsr).success(function(data) {
				
					var usrRes = data;
					console.log(usrRes);
					$scope.frmData.id = usrRes._id;
					$scope.frmData.empID = usrRes.empID;
					$scope.frmData.firstName = usrRes.firstName;
					$scope.frmData.lastName = usrRes.lastName;
					$scope.frmData.Email = usrRes.Email;
					$scope.frmData.Phone = usrRes.Phone;
					$scope.frmData.country = usrRes.country;
					$scope.frmData.username = usrRes.username;
					$scope.frmData.reportingTl = usrRes.Appraiser;
					$scope.frmData.reportingTM = usrRes.Reviewer;
					$scope.frmData.language = usrRes.language;
					$scope.frmData.role = usrRes.role;
					$scope.frmData.userType = usrRes.userType;
					$scope.frmData.accountType = usrRes.accountType;
					
					angular.copy($scope.frmData, $scope.EdtData);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}
	};

	if($scope.euserID) {
		$scope.editUser();
	}
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
