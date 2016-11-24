
apps.controller('locationCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {	 
	AjaxMethod.getPageLevelACl();
    $scope.data = {};
	$scope.frmData = {}; 
	var data = []; 
	$scope.menuTree = [];
	$scope.rolePer = false;
    $scope.datas = {};
    $rootScope.isShowDelivery = $rootScope.isAddButtonEnabled;
    $scope.createLocation = function(frmData) { 
        var insPath = 'createLocation';
        if($scope.frmData.id) { insPath = 'updateLocation'; }
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmLocation.$valid) {
        AjaxMethod.postMethod('master/'+insPath,$scope.frmData).then( function (response){
			if (data.errorMessage === null) 
			{
                $scope.frmData = {};
            } else { 
                if($scope.frmData.id) {
                    successMsg('Location', 'Location Updated successfully');
                    $rootScope.isShowDelivery = $rootScope.isAddButtonEnabled;
                    $scope.updateRowLocation($scope.frmData); 
                    $scope.clearfrm();
                    $scope.frmData = {};
                    $('#frmLocation').data('bootstrapValidator').resetForm();
                } else {
                    $scope.frmData.id = response.insertId;
                    $scope.addRowLocation($scope.frmData);
                    $scope.clearfrm();
                    $scope.frmData = {};
                    $('#frmLocation').data('bootstrapValidator').resetForm();
                    successMsg('Location', 'Location Created successfully'); 
                }
            }
		});
     }
	};
$scope.reset = function() {
        $scope.$broadcast('show-errors-reset');
    };
	$scope.Datainit = function (page,type) { 
		AjaxMethod.postMethod('master/'+page, {}).then(function(response){
			var data = response; 
			$scope.data = data; 
			if($scope.data.length > 0){
				$('#norecords').hide();
			}  
			$scope.tableParams.reload();
		});
	};
	$scope.tableParams = new NgTableParams({
        page: 1, // show first page
        count: 12, // count per page
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
			if(orderedData.length === 0) {
                $('#norecords').hide();    
            }
			
			params.total(orderedData.length); // set total for recalc pagination
			$scope.fdata = orderedData;
            if(orderedData.length > 0) {
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        }
    });
	$scope.editLocation = function(unitDet) {
        $rootScope.isShowDelivery = false;
        $scope.clearfrm();
        $scope.frmData.id = unitDet.location_id_pk;
        $scope.frmData.locationName = unitDet.location_name;
        $scope.frmData.remarks = unitDet.location_desc;
        $scope.frmData.status = (unitDet.status === 1)?true:false;
    };

    $scope.clearfrm = function() {
         $scope.reset();
        $scope.frmData = {};
    };

    $scope.getArrayIndexForKey =  function(arr, key, val){
		for(var i = 0; i < arr.length; i++){
			if(arr[i][key] === val) {
                return i;
            }
		}
		return -1;
	};

    $scope.updateRowLocation = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.data, 'location_id_pk', data.id); 
        if(index >= 0) {
            $scope.data[index].location_name = data.locationName;
            $scope.data[index].location_desc = data.remarks;
            $scope.data[index].status = (data.status === true)?1:0;
            $scope.tableParams.reload();
        }
    };

    $scope.updateLocationStatus = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.data, 'location_id_pk', data.id); 
        if(index >= 0) {
            $scope.data[index].status = (data.status === 1)?0:1;
            $scope.tableParams.reload();
        }
    };

	$scope.addRowLocation = function(cdata) { 
		// push a new object with some defaults
        cdata.status = (cdata.status === true)?1:0;
		var $ndata = {"location_id_pk": cdata.id, "location_name" : cdata.locationName, "location_desc" : cdata.remarks,"status" : cdata.status};
		$scope.data.splice(0, 0, $ndata);
		$scope.tableParams.reload();
	};

    $scope.chgLocStatus = function(mDet,status) {

        var dmsg = 'Enable Location "'+mDet.location_name+'". Are you sure?';
        if(status === 1) {
            dmsg = 'Disable Location "'+mDet.location_name+'". Are you sure?';
        }
            
        BootstrapDialog.confirm(dmsg, function(result){
            if(result) {
                
                var insPath = 'updateLocationStatus';
                $scope.frmData.id = mDet.location_id_pk; 
                $scope.frmData.status = status; 
                AjaxMethod.postMethod('master/'+insPath, $scope.frmData).then(function(data){
                    if (data) {

                        if(status === 1) {
                            successMsg('Location', 'Location Disabled successfully');
                        } else {
                            successMsg('Location', 'Location Enabled successfully');
                        }

                        $scope.updateLocationStatus($scope.frmData);

                        $scope.frmData = {}; // clear the form so our user is ready to enter another
                        
                    } 
                    if(data.errorMessage === '') {
                        $scope.frmData = {}; // clear the form so our user is ready to enter another
                        //location.reload(true);
                    }
                });
            }
        });
        
    };
    
});

/*validation*/
function objectFindByKey(array, key, val) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] == val) {
            return array[i];
        }
    }
    return null;
}

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
