
apps.controller('itmoduleCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q) {	 
    AjaxMethod.getPageLevelACl();
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
    $scope.data = {};
    $scope.frmData = {}; 
    $scope.headList = {}; 
    var data = []; 

    AjaxMethod.postMethod('itmodule/getCategories', {}).then(function(response){
        $scope.itCat = response[0]; 
        $scope.itSCat = response[1]; 
        console.log(response);
        //$scope.autoInc = response[2]; 
    });

    $scope.getTimezone = function () {
        AjaxMethod.postMethod('commatrix/getTimezone').then(function(response){
            $scope.tzoneData = response;
        });
    };
    
    $scope.loadreset = function() {
        $('#frmItmodule').data('bootstrapValidator').resetForm();
    };
    $scope.Datainit = function (page,type) { 
        AjaxMethod.postMethod('itmodule/'+page, {prjId:$rootScope.selProjectID}).then(function(response){
            $scope.headList = response[0];
            $scope.frmData = $scope.headList;
            $scope.frmData.roll_out_date = moment($scope.frmData.roll_out_date).format("YYYY-MM-DD");
            $scope.headList.t2 = alasql('SELECT * FROM ? t1 INNER JOIN ? t2 ON t2.itrrf_subctgy_id_pk = t1.itrrf_subctgy_id_fk', [$scope.headList.t2,$scope.itSCat]);
        });
    };

    $scope.checkValid = function(data, field) {
        if(data === "" || !data) {
            return "required";
        }
    };

    $scope.cancelNewRow = function(id){
        if(id[0] === 'n') {
            $scope.delIttransID(id);
        } 
    };
    $scope.save = function() {
      $scope.$broadcast('show-errors-check-validity');

      if ($scope.userForm.$valid) {
        alert('ok');
      }
    };
    $scope.saveItmodule = function() {
        $scope.$broadcast('show-errors-check-validity');

        if ($scope.frmItmodule.$valid) {
            AjaxMethod.postMethod('itmodule/saveItmodule', $scope.frmData).then(function(response){
                if (data) {
                    BootstrapDialog.confirm({
                        title: 'Step 2',
                        message: 'Do you want to fill Lab RRF Module?',
                        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                        closable: true, // <-- Default value is false
                        draggable: true, // <-- Default value is false
                        btnCancelLabel: 'Skip', // <-- Default value is 'Cancel',
                        btnOKLabel: 'Yes', // <-- Default value is 'OK',
                        btnOKClass: 'btn-success', // <-- If you didn't specify it, dialog type will be used,
                        callback: function(result) {
                        // result will be true if button was click, while it will be false if users close the dialog directly.
                            if(result) {
                                $location.path('/labModule');
                                $scope.$apply();
                            } else {
                                $location.path('/Capex');
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

        if($scope.itSCat.length) {
            selected = $filter('filter')($scope.itSCat, {itrrf_subctgy_id_pk: val});
        } 
        return selected.length ? selected[0].itrrf_subctgy_name : val;
    };
    $scope.getArrayIndexForKey =  function(arr, key, val){
        for(var i = 0; i < arr.length; i++){
            if(arr[i][key] === val) {
                return i;
            }
        }
        return -1;
    };
    $scope.updateIttransID = function(val, id) { 
        var index = $scope.getArrayIndexForKey($scope.headList.t2, 'itrrf_trans_id_pk', val);
        if(index >= 0) {
            $scope.headList.t2[index].itrrf_trans_id_pk = id;
        }
    };
    $scope.delIttransID = function(id) { 
        var index = $scope.getArrayIndexForKey($scope.headList.t2, 'itrrf_trans_id_pk', id);
        if(index >= 0) {
            $scope.headList.t2.splice(index, 1);
        }
    };

    $scope.saveItmodultTrans = function(data, mid, cid, id, ind) {
        data['itrrf_trans_mas_id_fk'] = mid;
        data['itrrf_ctgy_id_fk'] = cid;
        data['itrrf_trans_id_pk'] = id;
        data['itrrf_subctgy_id_fk'] = data.itrrf_subctgy_name;
        data['project_id_fk'] = $rootScope.selProjectID;
        angular.extend(data, {id: id});
        AjaxMethod.postMethod('itmodule/saveItmodultTrans', data).then(function(response){
            var firstChar  = data.id[0];
            if(firstChar === 'n') {
                $scope.updateIttransID(id,response.insertId);
            } 
        });
    };

  // remove user
  $scope.removeItTrans = function(pid) {
    BootstrapDialog.confirm('Are you sure?', function(result){
        if(result) {
            AjaxMethod.postMethod('itmodule/delItmodultTrans', {'id':pid}).then(function(response){
                if(response.affectedRows > 0) {
                    $scope.delIttransID(pid);
                }
            });
        }
    });
  };

  // add user
  $scope.addItTrans = function(key,mid,cid) {
    var milliseconds = new Date().getTime();
    $scope.inserted = {
        itrrf_trans_id_pk: 'n'+milliseconds,
        itrrf_ctgy_id_fk: cid,
        itrrf_subctgy_id_fk: '',
        itrrf_trans_mas_id_fk: mid,
        itrrf_trans_desc: '',
        itrrf_trans_remarks: '',
        project_id_fk: $rootScope.selProjectID
    };
    $scope.headList.t2.push($scope.inserted);
  };

});

/*apps.directive('showErrors', function($timeout) {
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
});*/

