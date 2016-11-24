
apps.controller('masterCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {    
    AjaxMethod.getPageLevelACl();
    $scope.data = {};
    $scope.frmData = {}; 
    var data = []; 
    $scope.menuTree = [];
    $scope.rolePer = false;
    $scope.datas = {};
    $rootScope.isShowDelivery = $rootScope.isAddButtonEnabled;
    $scope.createDelivery = function(frmData) {
        var insPath = 'createUnit';
        if($scope.frmData.id) { insPath = 'updateUnit'; }
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.frmdeliveryunit.$valid) {
            AjaxMethod.postMethod('master/'+insPath,$scope.frmData).then( function (response){
                if (data.errorMessage === null) 
                {  
                    $scope.frmData = {};
                } else { 
                    if($scope.frmData.id) {
                        successMsg('Delivery Unit', 'Delivery Unit Updated successfully');
                        //$('#frmRole').data('bootstrapValidator').resetForm();
                        // $rootScope.isShowDelivery = true;
                        // if (!$rootScope.isEditButtonEnabled && $rootScope.isAddButtonEnabled) {
                        //     $rootScope.isAddButtonEnabled = false;
                        // }else{
                        //     $rootScope.isAddButtonEnabled = true;
                        // }
                        $rootScope.isShowDelivery = $rootScope.isAddButtonEnabled;
                        $scope.updateRowUnit($scope.frmData); 
                        $scope.clearfrm();
                    } else {
                        $scope.frmData.id = response.insertId;
                        $scope.addRowUnit($scope.frmData);
                        $scope.clearfrm();
                        //$('#frmRole').data('bootstrapValidator').resetForm();
                        successMsg('Delivery Unit', 'Delivery Unit Created successfully'); 
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
			if($scope.data.length > 0) {
				$('#norecords').hide();
			}  
			$scope.tableParams.reload();
		});
	};

    
    $scope.tableParams = new NgTableParams({
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


	$scope.editUnit = function(unitDet) {
        $rootScope.isShowDelivery = false;        
        $scope.clearfrm();
        $scope.frmData.id = unitDet.dunit_id_pk;
        $scope.frmData.unitName = unitDet.dunit_name;
        $scope.frmData.remarks = unitDet.dunit_desc;
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

    $scope.updateRowUnit = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.data, 'dunit_id_pk', data.id); 
        if(index >= 0) {
            $scope.data[index].dunit_name = data.unitName;
            $scope.data[index].dunit_desc = data.remarks;
            $scope.data[index].status = (data.status === true)?1:0;
            $scope.tableParams.reload();
        }
    };

    $scope.updateUnitStatus = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.data, 'dunit_id_pk', data.id); 
        if(index >= 0) {
            $scope.data[index].status = (data.status === 1)?0:1;
            $scope.tableParams.reload();
        }
    };

    $scope.addRowUnit = function(cdata) { 
        // push a new object with some defaults
        cdata.status = (cdata.status === true)?1:0;
        var $ndata = {"dunit_id_pk": cdata.id, "dunit_name" : cdata.unitName, "dunit_desc" : cdata.remarks,"status" : cdata.status};
        $scope.data.splice(0, 0, $ndata);
        $scope.tableParams.reload();
    };

    $scope.chgUnitStatus = function(mDet,status) {

        var dmsg = 'Enable delivery unit "'+mDet.dunit_name+'". Are you sure?';
        if(status === 1) {
            dmsg = 'Disable delivery unit "'+mDet.dunit_name+'". Are you sure?';
        }
            
        BootstrapDialog.confirm(dmsg, function(result){
            if(result) {
                
                var insPath = 'updateUnitStatus';
                $scope.frmData.id = mDet.dunit_id_pk; 
                $scope.frmData.status = status; 
                AjaxMethod.postMethod('master/'+insPath, $scope.frmData).then(function(data){
                    if (data) {

                        if(status === 1) {
                            successMsg('Delivery Unit', 'Delivery Unit Disabled successfully');
                        } else {
                            successMsg('Delivery Unit', 'Delivery Unit Enabled successfully');
                        }

                        $scope.updateUnitStatus($scope.frmData);

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
/**/
apps.directive('showErrors', function($timeout) {
    return {
        restrict: 'A',
        require: '^form',
        link: function (scope, el, attrs, formCtrl) {
            // find the text box element, which has the 'name' attribute
            var inputEl   = el[0].querySelector("[name]");
            // convert the native text box element to an angular element
            var inputNgEl = angular.element(inputEl);
            // get the name on the text box
            var inputName = inputNgEl.attr('name');

            // only apply the has-error class after the user leaves the text box
            inputNgEl.bind('blur', function() {
                el.toggleClass('has-error', formCtrl[inputName].$invalid);
            });

            scope.$on('show-errors-check-validity', function() {

            el.toggleClass('has-error', formCtrl[inputName].$invalid);

            });

            scope.$on('show-errors-reset', function() {
                $timeout(function() {
                    el.removeClass('has-error');
                }, 0, false);
            });
        }
    };
});
/**/


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