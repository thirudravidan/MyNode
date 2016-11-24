
apps.controller('labmoduleCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {	 
    AjaxMethod.getPageLevelACl();
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
    $scope.data = {};
    $scope.frmData = {}; 
    $scope.headList = {}; 
    var data = []; 

    AjaxMethod.postMethod('labmodule/getCategories', {}).then(function(response){
        $scope.labCat = response[0]; 
        $scope.labSCat = response[1]; 
        console.log(response);
        //$scope.autoInc = response[2]; 
    });

    $scope.getTimezone = function () {
        AjaxMethod.postMethod('commatrix/getTimezone').then(function(response){
            $scope.tzoneData = response;
        });
    };

    $scope.Datainit = function (page,type) { 
        AjaxMethod.postMethod('labmodule/'+page, {prjId:$rootScope.selProjectID}).then(function(response){
            $scope.headList = response[0];
            console.log(response);
            $scope.frmData = $scope.headList;
            $scope.frmData.roll_out_date = moment($scope.frmData.roll_out_date).format("YYYY-MM-DD");
            $scope.headList.t2 = alasql('SELECT * FROM ? t1 INNER JOIN ? t2 ON t2.labrrf_subctgy_id_pk = t1.labrrf_subctgy_id_fk', [$scope.headList.t2,$scope.labSCat]);
        });
    };

    $scope.checkValid = function(data, field) {
        if(data === "" || !data) {
            return "required";
        }
    };

    $scope.cancelNewRow = function(id){
        if(id[0] === 'n') {
            $scope.delLabtransID(id);
        } 
    };

    $scope.saveLabmodule = function() {
        $scope.$broadcast('show-errors-check-validity');

        if ($scope.frmLabmodule.$valid) {
            AjaxMethod.postMethod('labmodule/saveLabmodule', $scope.frmData).then(function(response){
                if (data) {
                    BootstrapDialog.confirm({
                        title: 'Step 3',
                        message: 'Move to Capex module?',
                        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                        closable: true, // <-- Default value is false
                        draggable: true, // <-- Default value is false
                        btnCancelLabel: 'Back', // <-- Default value is 'Cancel',
                        btnOKLabel: 'Next', // <-- Default value is 'OK',
                        btnOKClass: 'btn-success', // <-- If you didn't specify it, dialog type will be used,
                        callback: function(result) {
                        // result will be true if button was click, while it will be false if users close the dialog directly.
                            if(result) {
                                $location.path('/Capex');
                                $scope.$apply();
                            } else {
                                $location.path('/itModule');
                                $scope.$apply();
                            }
                        }
                    });
                    //successMsg('Resource Plan Request Form', 'Resource Plan Request Form Saved Successfully');
                }
            });
        }
    };

    $scope.getSubName = function(val) {
        var selected = [];

        if($scope.labSCat.length) {
            selected = $filter('filter')($scope.labSCat, {labrrf_subctgy_id_pk: val});
        } 
        return selected.length ? selected[0].labrrf_subctgy_name : val;
    };
    $scope.getArrayIndexForKey =  function(arr, key, val){
        for(var i = 0; i < arr.length; i++){
            if(arr[i][key] === val) {
                return i;
            }
        }
        return -1;
    };
    $scope.updateLabtransID = function(val, id) { 
        var index = $scope.getArrayIndexForKey($scope.headList.t2, 'labrrf_trans_id_pk', val);
        if(index >= 0) {
            $scope.headList.t2[index].labrrf_trans_id_pk = id;
        }
    };
    $scope.delLabtransID = function(id) { 
        var index = $scope.getArrayIndexForKey($scope.headList.t2, 'labrrf_trans_id_pk', id);
        if(index >= 0) {
            $scope.headList.t2.splice(index, 1);
        }
    };

    $scope.saveLabmodultTrans = function(data, mid, cid, id, ind) {
        data['labrrf_trans_mas_id_fk'] = mid;
        data['labrrf_ctgy_id_fk'] = cid;
        data['labrrf_trans_id_pk'] = id;
        data['labrrf_subctgy_id_fk'] = data.labrrf_subctgy_name;
        data['project_id_fk'] = $rootScope.selProjectID;
        angular.extend(data, {id: id});
        AjaxMethod.postMethod('labmodule/saveLabmodultTrans', data).then(function(response){
            var firstChar  = data.id[0];
            if(firstChar === 'n') {
                $scope.updateLabtransID(id,response.insertId);
            } 
        });
    };

  // remove user
  $scope.removeLabTrans = function(pid) {
    BootstrapDialog.confirm('Are you sure?', function(result){
        if(result) {
            AjaxMethod.postMethod('labmodule/delLabmodultTrans', {'id':pid}).then(function(response){
                if(response.affectedRows > 0) {
                    $scope.delLabtransID(pid);
                }
            });
        }
    });
  };

  // add user
  $scope.addLabTrans = function(key,mid,cid) {
    var milliseconds = new Date().getTime();
    $scope.inserted = {
        labrrf_trans_id_pk: 'n'+milliseconds,
        labrrf_ctgy_id_fk: cid,
        labrrf_subctgy_id_fk: '',
        labrrf_trans_mas_id_fk: mid,
        labrrf_trans_desc: '',
        labrrf_trans_remarks: '',
        project_id_fk: $rootScope.selProjectID
    };
    $scope.headList.t2.push($scope.inserted);
  };

});

