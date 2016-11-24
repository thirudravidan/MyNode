apps.controller('clientCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {    
    AjaxMethod.getPageLevelACl();
    $scope.data = {};
    $scope.frmData = {}; 
    var data = []; 
    $scope.menuTree = [];
    $scope.rolePer = false;
    $scope.datas = {};
    /*$scope.createClient = function(frmData) { 
        var insPath = 'createclientUnit';
       if($scope.frmData.id) { insPath = 'updateClient'; }
       $scope.$broadcast('show-errors-check-validity');
       if ($scope.clientform.$valid) {
        console.log(frmData);
        AjaxMethod.postMethod('master/'+insPath,$scope.frmData).then( function (data){
            if (!data) {  
                successMsg('Client', 'Client unable to Save the Record');
                $scope.clearfrm();
            } else {
                $scope.frmData = {};
                $scope.Datainit('getclientUnit');
                //$('#frmRole').data('bootstrapValidator').resetForm();
                successMsg('Client', 'Client Created successfully'); 
                $scope.clearfrm();
            }
        });
    }
    };*/

    $scope.createClient = function(frmData) { 
        var insPath = 'createclientUnit';
       if($scope.frmData.id) { insPath = 'updateClient'; }
       $scope.$broadcast('show-errors-check-validity');
       if ($scope.clientform.$valid) {
        AjaxMethod.postMethod('master/'+insPath,$scope.frmData).then( function (data){
            if (!data) {
                successMsg('New Client', 'Client unable to Save the Record');
            }
            else {
                if ($scope.frmData.id) {
                     successMsg('Update Client', 'Client Details Updated successfully');
                     $scope.frmData = {};
                     $scope.Datainit('getclientUnit');
                     $scope.clearfrm(); 
                    }

                    else{

                        BootstrapDialog.confirm({
                            title: 'Client Creation',
                            message: 'Client created successfully. Do you want to create Project?',
                            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                            closable: true, // <-- Default value is false
                            draggable: true, // <-- Default value is false
                            btnCancelLabel: 'Skip', // <-- Default value is 'Cancel',
                            btnOKLabel: 'Yes', // <-- Default value is 'OK',
                            btnOKClass: 'btn-success', // <-- If you didn't specify it, dialog type will be used,
                            callback: function(result) {
                            // result will be true if button was click, while it will be false if users close the dialog directly.
                                if(result) {
                                    $rootScope.lastClientid=data.insertId;
                                    $location.path('/newproject');
                                    $scope.$apply();
                                } /*else {
                                    $location.path('/Capex');
                                    $scope.$apply();
                                }*/
                            }
                        });
                    //successMsg('Resource Plan Request Form', 'Resource Plan Request Form Saved Successfully');
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
            $scope.tableClient.reload();
        });
    };
    $scope.tableClient = new NgTableParams({
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
        $scope.clearfrm();
        $scope.frmData.id = unitDet.client_id_pk;
        $scope.frmData.clientname = unitDet.client_name;
        $scope.frmData.clientlocation = unitDet.client_location;
        $scope.frmData.clientstreet = unitDet.client_street;
        $scope.frmData.clientcity = unitDet.client_city;
        $scope.frmData.clientstate = unitDet.client_state;
        $scope.frmData.clientcountry = unitDet.client_country;
        $scope.frmData.clientphone = unitDet.client_phone;
        $scope.frmData.clientfax = unitDet.client_fax;
        $scope.frmData.clientemailid = unitDet.client_emailid;
        $scope.frmData.clientcontactperson = unitDet.client_contact_person;
        $scope.frmData.clientcontactpersondesignation = unitDet.client_contact_person_designation;
        $scope.frmData.clientremarks = unitDet.client_remarks;
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
