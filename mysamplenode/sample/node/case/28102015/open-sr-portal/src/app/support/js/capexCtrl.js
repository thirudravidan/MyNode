
apps.controller('capexCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q, Upload, $timeout) {	 
    AjaxMethod.getPageLevelACl();
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
    $rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
    $scope.data = {};
    $scope.frmData = {}; 
    $scope.capexTrans = {}; 
    $scope.capexMas = {};
    $scope.frmStatus = {};
    $scope.fileList = [];
    $scope.btnNew = false;
    $scope.showStatus = false;
    $scope.statusEdit = false;
    $scope.showCols = false;
    $scope.itShow = false;
    $scope.itEdit = false;
    $scope.btnName = 'Signoff';
    $scope.btnsignOff = false;
    var data = []; 
    $scope.HostingURL=golobalconfigs.downloadURL;
    $scope.Datainit = function (page,type) { 
        AjaxMethod.postMethod('capex/'+page, {prjId:$rootScope.selProjectID}).then(function(response){
            console.log(response);
            $scope.capexMas = response[0];
            
            if($scope.capexMas.bucket_from === $rootScope.loggedUserDet.user_role_id_fk) {
                $scope.btnNew = false;
                $scope.showStatus = true;
                $scope.statusEdit = false;
                $scope.showCols = false;
                $scope.itShow = false;
                $scope.itEdit = false;
                $scope.btnsignOff = false;
            }
            if($scope.capexMas.bucket_from > 0 && $scope.capexMas.bucket_to > 0 && $scope.capexMas.bucket_from != $rootScope.loggedUserDet.user_role_id_fk && $scope.capexMas.bucket_to != $rootScope.loggedUserDet.user_role_id_fk) {
                $scope.btnNew = false;
                $scope.showStatus = true;
                $scope.statusEdit = false;
                $scope.showCols = false;
                $scope.itShow = false;
                $scope.itEdit = false;
                $scope.btnsignOff = false;
            }

            if($scope.capexMas.bucket_from === 0 && $scope.capexMas.bucket_to === 0 && $rootScope.loggedUserDet.user_role_id_fk === 1) {
                $scope.btnNew = true;
                $scope.showStatus = false;
                $scope.statusEdit = false;
                $scope.showCols = true;
                $scope.itShow = false;
                $scope.itEdit = false;
                $scope.btnsignOff = true;
            }
            if($scope.capexMas.bucket_from === 7 && $scope.capexMas.bucket_to === 1 && $scope.capexMas.bucket_to === $rootScope.loggedUserDet.user_role_id_fk) {
                $scope.btnNew = false;
                $scope.showStatus = true;
                $scope.statusEdit = false;
                $scope.showCols = true;
                $scope.itShow = false;
                $scope.itEdit = false;
                $scope.btnsignOff = true;
            } else if($scope.capexMas.bucket_from === 1 && $scope.capexMas.bucket_to === 7 && $scope.capexMas.bucket_to === $rootScope.loggedUserDet.user_role_id_fk) {
                $scope.btnNew = false;
                $scope.showStatus = true;
                $scope.statusEdit = true;
                $scope.showCols = false;
                $scope.itShow = false;
                $scope.itEdit = false;
                $scope.btnsignOff = true;

            } else if($scope.capexMas.bucket_from === 7 && $scope.capexMas.bucket_to === 6 && $scope.capexMas.bucket_to === $rootScope.loggedUserDet.user_role_id_fk) {
                $scope.showStatus = true;
                $scope.statusEdit = false; 
                $scope.showCols = false;
                $scope.itShow = true;
                $scope.itEdit = true;
                $scope.btnNew = false;
                $scope.btnsignOff = true;
            } else if($scope.capexMas.bucket_from === 6 && $scope.capexMas.bucket_to === 9 && $scope.capexMas.bucket_to === $rootScope.loggedUserDet.user_role_id_fk) {
                $scope.showStatus = true;
                $scope.statusEdit = false; 
                $scope.showCols = false;
                $scope.itShow = true;
                $scope.btnNew = false;
                $scope.btnsignOff = true;
            } else if($rootScope.loggedUserDet.user_role_id_fk === 1) {
                $scope.btnName = 'Signoff';
            } else if($scope.capexMas.bucket_from === 0 && $scope.capexMas.bucket_to === 0) {
                $scope.btnName = 'Submit';
            }


            if($scope.capexMas.t2) {
                $scope.capexTrans['capex'] = alasql("SELECT * FROM ? WHERE ctype = 'capex'", [$scope.capexMas.t2]);
                $scope.capexTrans['opex'] = alasql("SELECT * FROM ? WHERE ctype = 'opex'", [$scope.capexMas.t2]);
                //$scope.calOverallTot();
            } else {
                $scope.capexTrans['capex'] = []; 
                $scope.capexTrans['opex'] = []; 
            }
            $scope.calOverallTot();
            
        });
    };

    $scope.statuses = [
        {value: 0, text: 'Pending'},
        {value: 1, text: 'Agree'},
        {value: 2, text: 'Dispute'}
    ]; 

    $scope.wstatus = [
        {value: 0, text: 'Yet To Start'},
        {value: 1, text: 'WIP'},
        {value: 2, text: 'Deployed'}
    ]; 

    $scope.seatcost_yn = [
        {value: 1, text: 'No'},
        {value: 2, text: 'Yes'}
    ]; 

    $scope.checkValid = function(data, field) {
        if(data === "" || !data) {
            return "required";
        }
    };

    $scope.sendBack = function() {
        BootstrapDialog.confirm({
            title: 'Move',
            message: 'Move to Resource Plan Request Form (or) LAB Resource Plan Request Form?',
            type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
            closable: true, // <-- Default value is false
            draggable: true, // <-- Default value is false
            btnCancelLabel: 'Resource Plan Request Form', // <-- Default value is 'Cancel',
            btnOKLabel: 'LAB Resource Plan Request Form', // <-- Default value is 'OK',
            btnOKClass: 'btn-success', // <-- If you didn't specify it, dialog type will be used,
            callback: function(result) {
            // result will be true if button was click, while it will be false if users close the dialog directly.
                if(result) {
                    // console.log($rootScope.userAclMenulst);
                    var labACL= alasql("SELECT * FROM ? WHERE routing_path = 'labModule'", [$rootScope.userAclMenulst])[0];
                    $rootScope.getindividualMenuACL(parseInt(labACL.acl_id_pk,10));
                    // console.log(lab);
                    $location.path('/labModule');
                    $scope.$apply();
                } else {
                    var itACL= alasql("SELECT * FROM ? WHERE routing_path = 'itModule'", [$rootScope.userAclMenulst])[0];
                    $rootScope.getindividualMenuACL(parseInt(itACL.acl_id_pk,10));
                    $location.path('/itModule');
                    $scope.$apply();
                }
            }
        });
    };

    $scope.seatcost = function(data) {
        var selected = [];
        if(data.seat_cost) {
            selected = $filter('filter')($scope.seatcost_yn, {value: data.seat_cost});
        }
        return selected.length ? selected[0].text : 'No';
    };

    $scope.calOverallTot = function() {
        $scope.capexTot = ($scope.capexTrans['capex'].length > 0)?alasql("SELECT SUM(total) as tot FROM ? WHERE ctype = 'capex'", [$scope.capexTrans['capex']])[0]:{'tot':0};
        $scope.opexTot =  ($scope.capexTrans['opex'].length > 0)?alasql("SELECT SUM(total) as tot FROM ? WHERE ctype = 'opex'", [$scope.capexTrans['opex']])[0]:{'tot':0};
        
        console.log($scope.capexTrans['capex']);
        console.log($scope.capexTrans['capex'].length +' === '+ $scope.capexTrans['opex'].length);
        console.log($scope.capexTot);
        console.log($scope.opexTot);
        $scope.Overall =  $scope.capexTot.tot + $scope.opexTot.tot;
    };

    $scope.calculateData = function(data) {
        var res = (parseInt(data.item_qty, 10) * parseFloat(data.unit_cost, 10));
        return (isNaN(res)) ? 0 : res.toFixed(2);
    };

    $scope.uploadFiles = function (file, errFiles, id) {
        $scope.fileList[id] = file; 
        console.log($scope.fileList);
        console.log(errFiles);
    };

    $scope.saveCapexTrans = function(fdata, type, pid, id, index, picFile) {
        fdata['t_co_trans_mas_id_fk'] = pid;
        fdata['ctype'] = type;
        fdata['project_id_fk'] = $rootScope.selProjectID;
        //fdata['file'] = $scope.fileList[id];
        angular.extend(fdata, {id: id});
        if($scope.fileList[id]) {
            Upload.upload({ 
                url: 'caseTracker/capex/uploadDoc',
                data: {file: $scope.fileList[id]}
            }).progress(function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n');
            }).success(function (data, status, headers, config) {
                fdata['file'] = data.srcfile;
                console.log(fdata);
                AjaxMethod.postMethod('capex/saveCapexTrans', fdata).then(function(response){
                    if(id[0] === 'n') {
                        $scope.capexTrans[type][index].t_co_trans_id_pk = response.insertId;
                    }
                    $scope.capexTrans[type][index].ctype = type;
                    $scope.capexTrans[type][index].status = 0;
                    $scope.capexTrans[type][index].filename = data.srcfile;
                    $scope.capexTrans[type][index].total = (parseInt(fdata.item_qty,10) * parseFloat(fdata.unit_cost,10));
                    $scope.calOverallTot();
                });
            });
        } else {
            AjaxMethod.postMethod('capex/saveCapexTrans', fdata).then(function(response){
                if(id[0] === 'n') {
                    $scope.capexTrans[type][index].t_co_trans_id_pk = response.insertId;
                } 
                $scope.capexTrans[type][index].ctype = type;
                $scope.capexTrans[type][index].status = 0;
                $scope.capexTrans[type][index].total = (parseInt(fdata.item_qty,10) * parseFloat(fdata.unit_cost,10));
                $scope.calOverallTot();
            });
        }
    };

    $scope.setComments = function(val){
        $scope.isStatusComments = true;
        if(val === 2) {
            $scope.isStatusComments = false;    
        }
    };

    $scope.saveCapexStatusPop = function(type, field, id, index,val,scomment) {

        $scope.frmStatus.pid = id; 
        $scope.frmStatus.type = type; 
        $scope.frmStatus.field = field; 
        $scope.frmStatus.status = val; 
        $scope.frmStatus.index = index; 
        $scope.frmStatus.scomments = scomment; 
        $scope.setComments(val);
        console.log($scope.frmStatus);
        $('#statusModal').modal('show');
    };

    $scope.saveCapexStatus = function() {
        if($scope.frmStatus.status === '') {
            return false;
        }
        AjaxMethod.postMethod('capex/saveCapexStatus', $scope.frmStatus).then(function(data){
            if (data) {
                $('#statusModal').modal('hide');
                successMsg('Capex Status', 'Status changed successfully');
                $scope.capexTrans[$scope.frmStatus.type][$scope.frmStatus.index][$scope.frmStatus.field] = $scope.frmStatus.status;
                $scope.capexTrans[$scope.frmStatus.type][$scope.frmStatus.index]['status_comments'] = $scope.frmStatus.scomments;
                $scope.frmStatus = {}; 
            } 
        });
    };

    $scope.saveCapexITStatus = function(type, field, val, id, index) {
        $scope.frmData.pid = id; 
        $scope.frmData.type = type; 
        $scope.frmData.field = field; 
        $scope.frmData.status = val; 
        $scope.frmData.index = index; 

        AjaxMethod.postMethod('capex/saveCapexStatus', $scope.frmData).then(function(data){
            if (data) {
                successMsg('Capex Status', 'Status changed successfully');
                $scope.capexTrans[type][index][field] = val;
                $scope.frmData = {}; 
            } 
        });
    };


    $scope.signoffCapex = function() {
        var msg = '';
        if($rootScope.loggedUserDet.user_role_id_fk === 1) {
            $scope.frmData.bucket_from = 1; 
            $scope.frmData.bucket_to = 7; 
            msg = "Are you sure to signoff?";
        } else if($rootScope.loggedUserDet.user_role_id_fk === 7) {
            //Approved
            var capCnt1 = alasql("SELECT COUNT(*) as cnt FROM ? WHERE status = 1 AND ctype = 'capex'", [$scope.capexTrans['capex']])[0];
            var opCnt1 = alasql("SELECT COUNT(*) as cnt FROM ? WHERE status = 1 AND ctype = 'opex'", [$scope.capexTrans['opex']])[0];
            //Rejected
            var capCnt2 = alasql("SELECT COUNT(*) as cnt FROM ? WHERE status = 2 AND ctype = 'capex'", [$scope.capexTrans['capex']])[0];
            var opCnt2 = alasql("SELECT COUNT(*) as cnt FROM ? WHERE status = 2 AND ctype = 'opex'", [$scope.capexTrans['opex']])[0];
            //Pending
            var capCnt3 = alasql("SELECT COUNT(*) as cnt FROM ? WHERE status = 0 AND ctype = 'capex'", [$scope.capexTrans['capex']])[0];
            var opCnt3 = alasql("SELECT COUNT(*) as cnt FROM ? WHERE status = 0 AND ctype = 'opex'", [$scope.capexTrans['opex']])[0];

            if(capCnt3.cnt > 0 || opCnt3.cnt > 0) {
                successMsg('Status', 'Change all the Capex and opex status without any pending');
                return false;
            } else if(capCnt2.cnt > 0 || opCnt2.cnt > 0) {
                $scope.frmData.bucket_from = 7; 
                $scope.frmData.bucket_to = 1; 
                msg = "Some of the status are set as 'Rejected' so capex reassigned to SR Manager";
            } else {
                $scope.frmData.bucket_from = 7; 
                $scope.frmData.bucket_to = 6;
                msg = "All status are changed as 'Accepted'. Are you sure to signoff?"; 
            }
        } else if($rootScope.loggedUserDet.user_role_id_fk === 6) {
            //Completed
            var capCnt = alasql("SELECT COUNT(*) as cnt FROM ? WHERE itstatus != 1 AND ctype = 'capex'", [$scope.capexTrans['capex']])[0];
            var opCnt = alasql("SELECT COUNT(*) as cnt FROM ? WHERE itstatus != 1 AND ctype = 'opex'", [$scope.capexTrans['opex']])[0];

            if(capCnt.cnt > 0 || opCnt.cnt > 0) {
                successMsg('Status', 'Change all the Capex and opex status set to complete before signoff');
                return false;
            } else {
                $scope.frmData.bucket_from = 6; 
                $scope.frmData.bucket_to = 9;
                msg = "All work status are changed as 'Completed'. Are you sure to signoff?"; 
            }
        }

        BootstrapDialog.confirm(msg, function(result){
            if(result) {
                $scope.frmData.prjId = $rootScope.selProjectID; 
                $scope.frmData.prjName = $rootScope.selProjectName; 
                $scope.frmData.id = $scope.capexMas.t_co_trans_mas_id_pk; 
                $scope.frmData.id = $scope.capexMas.t_co_trans_mas_id_pk; 
                AjaxMethod.postMethod('capex/signOffCapex', $scope.frmData).then(function(data){
                    if (data) {
                        successMsg('Capex', 'Capex Form signoff successfully');
                        $scope.frmData = {}; // clear the form so our user is ready to enter another
                        $scope.Datainit('getCapex','i');
                        //$location.path('/Capex');
                    } 
                });
            }
        });
    };

    $scope.cancelNewRow = function(id, key,index){
        if(id[0] === 'n') {
            $scope.capexTrans[key].splice(index, 1);
        } 
    };

    // add CapexTrans
    $scope.addCapexTrans = function(key,id) {
        var milliseconds = new Date().getTime();
        $scope.inserted = {
            t_co_trans_id_pk: 'n'+milliseconds,
            t_co_trans_mas_id_fk: id,
            t_co_serial_no: '',
            item_desc: '',
            item_qty: '',
            unit_cost: '',
            total: '',
            delivery_date: '',
            comments: '',
            seat_cost: '',
            ctype: key
        };
        $scope.capexTrans[key].push($scope.inserted);
    };  
//`t_co_trans_id_pk`, `t_co_trans_mas_id_fk`, `t_co_serial_no`, `item_desc`, `item_qty`, `unit_cost`, `total`, `delivery_date`, `comments`, `seat_cost`, `ctype`
});
