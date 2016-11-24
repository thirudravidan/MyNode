
apps.controller('userCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q,Upload) {	 
    AjaxMethod.getPageLevelACl();
	$scope.data = [];
	$scope.frmData = {}; 
	var data = []; 
	$scope.menuTree = [];
	$scope.rolePer = false;
    $scope.datas = {};  
    $scope.frmLoad ={};  
    $scope.tables = {};
    $scope.userName = 'userLst';
    $scope.mapProjName = 'mappedProjLst';
    $scope.editASLlst = 'editACLLst';
    $scope.isInvalidFile =false;
    $scope.frmData.profileURL ='download/userprofile/user.jpg';
   
    $scope.enableControls =function (){
        $scope.isEmployeeSerach =true;
        $scope.isFirstName =false;
        $scope.isLastName =false;
        $scope.isEmail =false;
    };

    $scope.uploadImg =function (filDet){    
       if (filDet) {
           if (filDet.type.indexOf('image') === -1) {
                $scope.profPic='';
                $scope.isInvalidFile =true; 
            }else{
                $scope.isInvalidFile =false; 
            }
       }
    };
    
    $scope.createUser = function(frmData) { 
        var insPath = 'createUser';
        if($scope.frmData.id) { insPath = 'updateUser'; }
        $scope.$broadcast('show-errors-check-validity');        
         
        if ($scope.userCreatefrm.$valid) {
            if ($scope.profPic !== undefined && $scope.profPic !=='') {

                 Upload.upload({ 
                    url: 'caseTracker/user/uploadprofilePic',
                    data: {file: $scope.profPic}
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
                        //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n');
                    }).success(function (data, status, headers, config) {
                        $scope.frmData.profileURL = ($scope.profPic.name !== undefined) ? 'download/userprofile/'+$scope.profPic.name : 'download/userprofile/user.jpg';
                        $scope.saveUser(insPath);
                        $scope.profPic ='';
                  });
                }
                else
                {
                    $scope.saveUser(insPath);       
                }
        }else{
            return false;
        }
	};

    $scope.saveUser =function (insPath){
        
        AjaxMethod.postMethod('user/'+insPath,$scope.frmData).then( function (response){
            if (data.errorMessage === null) {  
                $scope.frmData = {};
            } else { 
                if($scope.frmData.id) {
                    successMsg('Update User', 'User Updated successfully');
                    //$('#frmRole').data('bootstrapValidator').resetForm();
                    $scope.frmData = {};
                    $scope.clearfrm();
                } else {
                    $scope.frmData = {};
                    $scope.clearfrm();
                    //$('#frmRole').data('bootstrapValidator').resetForm();
                    successMsg('Create User', 'User Created successfully'); 
                }
                // AjaxMethod.collapseToggle('collapse');
                $scope.Datainit('getUser','userLst','','');
            }
        });
    };

    $scope.reset = function() {
        $scope.$broadcast('show-errors-reset');
    };

    $scope.getCDMEmployee =function (){
        AjaxMethod.postMethod('user/getActiveCDMEmployee',{}).then( function (response){
            $scope.cdmEmployeeDetails =response;
        });
    };

    $scope.$watch( 'selectedEmpDetails', function( newObj, oldObj ) {
        if (angular.isObject(newObj)) {
            $scope.frmData.firstName =newObj.Emp_Name;
            $scope.isEmail =(newObj.Office_Email === null) ? false : true;
            $scope.frmData.email =(newObj.Office_Email === null) ? '' : newObj.Office_Email;
            $scope.frmData.mobileNo =parseInt(newObj.Mobile_No,10);

        }
    }, false); 

    $scope.userTypeChange = function (usrTypeID){
        if (usrTypeID === 3) {
            $scope.isEmployeeSerach =false;
            $scope.isFirstName = $scope.isLastName = $scope.isEmail =true;           
        }else{
            $scope.isEmployeeSerach =true;
            $scope.isFirstName = $scope.isLastName = $scope.isEmail =false; 
            $scope.frmData.firstName = $scope.frmData.email = $scope.frmData.mobileNo = $scope.selectedEmpDetails = '';
        }
    };

    $scope.editUser = function (userDet) {
        $scope.clearfrm();
        $scope.frmData.id = userDet.user_id_pk;
        $scope.frmData.firstName = userDet.first_name;
        $scope.frmData.lastName = userDet.last_name;
        $scope.frmData.email = userDet.email;
        $scope.frmData.mobileNo = parseInt(userDet.mobile_no, 10);
        $scope.frmData.userType = userDet.user_type_id_fk;
        $scope.frmData.division = '';
        $scope.frmData.usrRole = userDet.user_role_id_fk;
        $scope.isUserUpdate = $scope.isEmail = true;  
        $scope.frmData.profileURL =  userDet.profilepicurl;    
        if(userDet.division_id !== null) {
            $scope.frmData.division = userDet.division_id.split(',');
            $scope.frmData.division.forEach(function (value, key) {
                $scope.frmData.division[key] = parseInt(value, 10);    
            });
        }
        $scope.frmData.status = (userDet.status === 1)?true:false;
    };

    $scope.clearfrm = function() {
        $scope.reset();
        $scope.enableControls();
        $scope.frmData = {};
        $scope.selectedEmpDetails='';
    };

    $scope.loadData = function () {
        AjaxMethod.postMethod('user/defaultSet').then(function(response){
            $scope.frmLoad.userType = response.userType;
            $scope.frmLoad.division = response.division;
            $scope.Datainit('getUser','userLst','','');
        });
    };

    $scope.getuserRole = function () {
        AjaxMethod.postMethod('user/userRole').then(function(response){
            $scope.frmLoad.userRoleDet = response;
        });
    };


	$scope.Datainit = function (page,tableName,userID,projID) { 
        // $scope.getCDMEmployee();
        if (tableName === 'userLst') {
            AjaxMethod.postMethod('user/'+page, {}).then(function(response){
                $scope.data = response;
                if($scope.data.length > 0){
                    $('#norecords').hide();
                }              
                $scope[tableName].page(1);
                $scope[tableName].reload();
             });
        }else if(tableName ==='mappedProjLst'){
            AjaxMethod.postMethod('user/'+page, {"userID" : userID}).then(function(response){
                $scope.data = response;
                if($scope.data.length > 0){
                    $('#norecords').hide();
                }  
                $rootScope.mappedProjects = response;                
                $scope[tableName].page(1);
                $scope[tableName].reload();                
             });
        }
	};

    $scope.getTables = function () {
        return new NgTableParams({
                page: 1,            // show first page
                count: 8          // count per page
            }, {
                counts: [],
                total: $scope.data.length, // length of data
                getData: function($defer, params) {
                // use build-in angular filter
                    var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                    orderedData = params.filter() ? $filter('filter')(orderedData, params.filter()) :orderedData;
                    params.total(orderedData.length);
                    if(orderedData.length > 0) {
                        $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                    } else {
                      return orderedData;
                    }
                }
        });
    };

    $scope.userLst = $scope.getTables();
    $scope.mappedProjLst = $scope.getTables();
    // $scope.editACLLst = $scope.getTables();

    $scope.chgUserStatus = function(mDet,status) {
        var dmsg = 'Enable User "'+mDet.first_name+'". Are you sure?';
        if(status === 1) {
            dmsg = 'Disable User "'+mDet.first_name+'". Are you sure?';
        }            
        BootstrapDialog.confirm(dmsg, function(result){
            if(result) {
                var insPath = 'updateUserStatus';
                $scope.frmData.id = mDet.user_id_pk; 
                $scope.frmData.status = status; 
                AjaxMethod.postMethod('user/'+insPath, $scope.frmData).then(function(data){
                    if (data) {
                        if(status === 1) {
                            successMsg('User Status', 'User Disabled successfully');
                        } else {
                            successMsg('User Status', 'User Enabled successfully');
                        }
                        $scope.updateUserStatus($scope.frmData);
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

    $scope.updateUserStatus = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.data, 'user_id_pk', data.id); 
        if(index >= 0) {
            $scope.data[index].status = (data.status === 1)?0:1;
            $scope.tableParams.reload();
        }
    };
    
    $scope.getArrayIndexForKey =  function(arr, key, val){
        for(var i = 0; i < arr.length; i++){
            if(arr[i][key] === val) {
                return i;
            }
        }
        return -1;
    };

    $scope.addProjectMapping =function (usrdet){
        console.log(usrdet);
        $scope.isShowProjectMapping=true;
        $scope.isShowEditAcl=false;
        $scope.isShowDashboardAcl =false;
        $rootScope.selectedusrDet =usrdet;
        $scope.mappingusrName =usrdet.first_name;
        $rootScope.mappingUserID =usrdet.user_id_pk;
        $scope.aclEditHeader ="Project :";
        $scope.mappingProjects =[]; 
        $scope.aclHeader="Project Mapping";
        $scope.Datainit('getMappedProjDetails','mappedProjLst',usrdet.user_id_pk,'');
         AjaxMethod.postMethod('user/getmapProjects',{"userId" : usrdet.user_id_pk ,"divisionID" : usrdet.division_id}).then(function(data){
            console.log(data);
            $scope.mappingProjects =data;
         });
    };

    $scope.mapUserProject =function (mapProjDet){
        var msg='Do you want to map the project ('+mapProjDet.project_name+') to '+$scope.mappingusrName+' ?';
        BootstrapDialog.confirm(msg, function(result){
            if(result) {  
                var param={};
                param.UserID = $rootScope.mappingUserID;             
                param.projectID = mapProjDet.project_id_pk;
                param.divisionID = mapProjDet.division_id_fk;
                AjaxMethod.postMethod('user/saveUserProjectMap', param).then(function(data){
                    if (data.mapres) {
                        $scope.addProjectMapping($rootScope.selectedusrDet);
                    }                   
                });
            }
        });
    };

    $scope.showDashboardACL =function (usrdet){        
        $scope.isShowEditAcl = false;
        $scope.isShowProjectMapping = false;
        $scope.isShowDashboardAcl =true;
        $scope.editedProjName =usrdet.first_name;
        $rootScope.mappingUserID =usrdet.user_id_pk;
        AjaxMethod.postMethod('user/getUserDashboard',{"userID" : usrdet.user_id_pk}).then(function(data){
            $scope.userDashboardDetails =data;
         });
    };

     $scope.chgDashStatus = function(dashDet,status) {
        var dmsg = 'Enable Dashboard "'+dashDet.db_name+'". Are you sure?';
        if(status === 1) {
            dmsg = 'Disable Dashboard "'+dashDet.db_name+'". Are you sure?';
        }            
        BootstrapDialog.confirm(dmsg, function(result){
            if(result) {                
                var param ={};
                param.userID = $rootScope.mappingUserID;
                param.dashBoardID = dashDet.db_id_pk;
                param.status = status;
                AjaxMethod.postMethod('user/updateDashBoardStatus', param).then(function(data){
                    if (data) {
                        if(status === 1) {
                            successMsg('DashBoard Status', 'DashBoard Disabled successfully');
                        } else {
                            successMsg('DashBoard Status', 'DashBoard Enabled successfully');
                        }
                        $scope.updateDashStatus(param);
                    }                     
                });
            }
        });        
    };

    $scope.updateDashStatus = function(data) { 
        var index = $scope.getArrayIndexForKey($scope.userDashboardDetails, 'db_id_pk', data.dashBoardID); 
        if(index >= 0) {
            $scope.userDashboardDetails[index].STATUS = (data.status === 1)?0:1;
            // $scope.tableParams.reload();
        }
    };

    $scope.showProEditACL=function (projID,userID,projName){
          $scope.getACLMaster();
          $scope.isShowEditAcl=true;
          $scope.editedProjName =projName;
          AjaxMethod.postMethod('user/getUserACLList', {"projectID" : projID,"userID" :userID}).then(function(response){
            $scope.editACLLst = $rootScope.aclList = response;
         });
        $('.editaclslide').slimScroll({alwaysVisible: false});    
    };

    $scope.getACLMaster =function (){
        AjaxMethod.postMethod('user/getACLMaster', {}).then(function(response){
            $scope.aclMaster = response;   
        });
    };

    $scope.showSelVal = function(val) {
        var sArr = [];
        var selected = [];
        $scope.sArr = [];
        var cond = {};
        var dfield = '';
        $scope.sArr = $scope.aclMaster;
        cond = {acl_id_pk: val};
        dfield = "acl_name";
        if($scope.sArr.length) {
          selected = $filter('filter')($scope.sArr, cond);
        } 
        return selected.length ? selected[0][dfield] : '';
    };

    $scope.updateACL = function (acl,proid,userid,moduleid){       
        var param={};
        param.projectID =proid;
        param.userID =userid;
        param.moduleID =moduleid;
        param.aclID =acl.acl_id_pk;
        AjaxMethod.postMethod('user/updateProjectACL',param).then(function(response){
        });
    };

    $scope.showUserACL =function (usrDet){
        $scope.isShowProjectMapping=false;
        $scope.isShowEditAcl=true;
        $scope.isShowDashboardAcl =false;
        $scope.aclHeader="User Edit ACL";
        $scope.aclEditHeader ="Name :";
        $scope.getACLMaster();
        $scope.editedProjName =usrDet.first_name;
          AjaxMethod.postMethod('user/getUserAdminACL', {"userID" :usrDet.user_id_pk}).then(function(response){
            $scope.editACLLst = $rootScope.aclList = response;
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

function isCharacterKey(evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;
    if ((charCode < 65 || charCode > 90) && (charCode < 96 || charCode > 122) && charCode != 32 && charCode != 8 && charCode != 9){
        return false;
    }else{
        return true;    
    }
}

// function loadEmployee(){
//     console.log('loadEmployee called');
//     $(document).ready(function () {
//         $("#SearchEmployee").autocomplete({
//             source: function (request, response) {
//                 $.ajax({
//                     type: "POST",
//                     contentType: "application/json; charset=utf-8",
//                     url: "caseTracker/user/getActiveCDMEmployee",
//                     data: '{"empName": "' + $('#SearchEmployee').val() + '"}',
//                     dataType: "json",
//                     success: function (res) {
//                         $.each(res, function (key, element) {
//                             empNames = [];
//                             for (i = 0; i < element.length; i++) {
//                                 empNames[i] = element[i].EmpName;
//                             }
//                         });
//                         console.log('empNames',empNames);
//                         response(empNames);
//                     },
//                     error: function (result) {
//                     }

//                 });
//             },
//             close: function (event, ui) {
//                 // Getdata();
//             }
//         });
//     });
// }
