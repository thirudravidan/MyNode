
apps.controller('sowsummaryCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {    
    AjaxMethod.getPageLevelACl();
    $scope.data = {};
    $scope.frmData = {}; 
    var data = []; 
    $scope.menuTree = [];
    $scope.rolePer = false;
    $scope.datas = {};
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');    
    
    $scope.createSow = function(frmData) { 
        var insPath = 'createsowUnit';
       if($scope.frmData.id) { insPath = 'updateSow'; }
        console.log(frmData);
        $scope.frmData.projectID =$rootScope.selProjectID;
        AjaxMethod.postMethod('master/'+insPath,$scope.frmData).then( function (data){
            if (!data) {  
                successMsg('Sow', 'Sow unable to Save the Record');
            } else {
                $scope.frmData = {};
                $scope.Datainit('getsowUnit');
                //$('#frmRole').data('bootstrapValidator').resetForm();
                successMsg('Sow', 'Sow Created successfully'); 
            }
        });
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

    $scope.editUnit = function(summaryDet) {

        $scope.frmData.id = summaryDet.sow_id_pk;
        $scope.frmData.sowsummarysla = summaryDet.sla;
        $scope.frmData.sowsummaryparameter = summaryDet.parameter;
        $scope.frmData.sowsummarymatrix = summaryDet.matrix;
        $scope.frmData.sowsummarydescription = summaryDet.desc;
        $scope.frmData.status = (summaryDet.status === 1)?true:false;
    };

    $scope.clearfrm = function() {
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
// $(document).ready(function(){
//     $(".flip").click(function(){
//         $(".panel").slideToggle("slow");
//          $(".tablehide").hide("slow");
//     });

//      $(".flipup").click(function(){
//         $(".panelup").slideUp("slow");
//         $(".tablehide").show("slow");
//     });
// });
