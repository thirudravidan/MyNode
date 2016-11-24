apps.controller('orgchartCtrl', function ($cookies,$rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q,Upload,$window) {    
    AjaxMethod.getPageLevelACl();
    $rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
    $scope.orgData = [];
    $scope.orgGen = [];
    $scope.frmData = {};
    $scope.frmTemp = {};
    $scope.rmId = [];
    $scope.isshoworgchart =false;
    $scope.isshowcreateorg =false;
    $scope.isshowTemplate =false;
    $scope.isInvalidFile =false;
    $scope.frmData.profileURL ='download/orgprofile/user.jpg';

    $scope.Datainit = function () { 
        AjaxMethod.postMethod('orgchart/viewOrgChart', {pid:$rootScope.selProjectID}).then(function (response){
            if(response.orgChart.length > 0) {
                $scope.isshoworgchart =true;
                $scope.orgGen = response.orgChart;
                $scope.orgData = getOrgNested($scope.orgGen, 0);
                /*scroll*/
                $(document).ready(function(){
                
                $(".demo-yx").mCustomScrollbar({
                    axis:"yx"
                }); 
                
                });
                /*scroll*/
            } else {
                $scope.isshowTemplate =true;
                $scope.frmTemp.templates = response.tplRes;
                $scope.frmTemp.project_id = $rootScope.selProjectID;
                // $('#tplModal').modal('show');
            }
        });
    };

    $scope.checkName = function (data,frmTemp) {
        if(data === '') { 
            return false;
        }
        frmTemp.project_id = $rootScope.selProjectID;       
        AjaxMethod.postMethod('orgchart/createTemplate', frmTemp).then(function (response){
            frmTemp.templateName = '';
        });
    };

    $scope.loadTemplate = function (frmTemp) {
        AjaxMethod.postMethod('orgchart/getTemplate', $scope.frmTemp).then(function (response){
            if(response.result) {
                $scope.Datainit(response.projectId);
                // $('#tplModal').modal('hide');
                $scope.isshowTemplate =false;
            }
        });
    };

    $scope.createNode = function () {
        // $('#tplModal').modal('hide');
        // $scope.isshowTemplate =false;
        $scope.frmData.type = '';
        $scope.frmData.project_id_fk = $scope.frmTemp.project_id;
        $scope.frmData.org_chart_id_pk = parseInt(0, 10);
        $scope.frmData.parent_id = parseInt(0, 10);
        $scope.frmData.org_chart_id_pk_tmp = parseInt(0, 10);
        $scope.frmData.level = parseInt(0, 10);
        $('#myModal').modal('show');
        $scope.isshoworgchart =false;
        $scope.isshowcreateorg =true;
    };

    $scope.rmNode = function (data, keyIndex) {
        var rmIndex = '';
        if(data) {
            $scope.rmId.push(data.org_chart_id_pk);
            var ids = $scope.getOrgId($scope.orgGen, data.org_chart_id_pk);
            if(ids) {
                $scope.rmId.forEach(function (value, key) {
                    rmIndex = $scope.orgGen.map(function (item) {
                            return item.org_chart_id_pk;
                        }).indexOf(value);
                    delete $scope.orgGen[rmIndex];
                });
                AjaxMethod.postMethod('orgchart/rmOrgChart', {rmIds:$scope.rmId}).then(function (response){
                    $scope.orgData = getOrgNested($scope.orgGen, 0);
                });
            }
        }
    };

    $scope.addNode = function (type,data) {
        $scope.frmData.type = type;
        $scope.frmData.project_id_fk = $rootScope.selProjectID;
        $scope.frmData.org_chart_id_pk = data.org_chart_id_pk;
        $scope.frmData.org_chart_id_pk_tmp = data.org_chart_id_pk_tmp;
        $scope.frmData.parent_id = data.parent_id;
        $scope.frmData.level = (parseInt(data.level, 10) + 1);
        $scope.frmData.name ='';
        $scope.frmData.designation ='';
        $scope.frmData.level ='';
        $scope.frmData.email ='';        
        $scope.frmData.profileURL =  'download/orgprofile/user.jpg'; 
        $scope.profPic='';
        if(type === 'upd') {
            $scope.frmData.name = data.name;
            $scope.frmData.designation = data.designation;
            $scope.frmData.level = data.level;
            $scope.frmData.email =  data.email; 
            $scope.frmData.profileURL =  data.profileurl; 
            
        }
        $('#myModal').modal('show');
    };
    $scope.gotoTemplate =function (){
        $scope.isshowcreateorg =false;
        $scope.isshoworgchart =false;
        $scope.isshowTemplate =true;
        
    };

    $scope.openmail =function (mail){
        $window.location = "mailto:"+mail;
    };

    $scope.saveNode = function () {
        $scope.$broadcast('show-errors-check-validity'); 
        if ($scope.createOrg.$valid) {
            var insPath = 'addOrgChart';
            if($scope.frmData.type == 'upd') { insPath = 'updOrgChart'; }
            if ($scope.profPic !== undefined && $scope.profPic !=='') {
             Upload.upload({ 
                url: 'caseTracker/orgchart/uploadorgPic',
                data: {file: $scope.profPic}
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n');
                }).success(function (data, status, headers, config) {
                    $scope.frmData.profileURL = ($scope.profPic.name !== undefined) ? 'download/orgprofile/'+$scope.profPic.name : 'download/orgprofile/user.jpg';
                    $scope.saveNodeDetails(insPath);
                    $scope.profPic ='';
              });
            }else{
                $scope.saveNodeDetails(insPath);
            }

        }else{
            return false;
        }        
    };

    $scope.saveNodeDetails =function(insPath){
        AjaxMethod.postMethod('orgchart/'+insPath, $scope.frmData).then(function (response){
            if($scope.frmData.type == 'upd') {
                $scope.updateRowOrg($scope.frmData); 
                $scope.orgData = getOrgNested($scope.orgGen, 0);
                
            } else {
                var orgData = {
                    org_chart_id_pk:response.insertId,
                    org_chart_id_pk_tmp:response.insertId,
                    parent_id:$scope.frmData.org_chart_id_pk_tmp,
                    name:$scope.frmData.name,
                    designation:$scope.frmData.designation,
                    project_id_fk:$scope.frmData.project_id_fk,
                    level:$scope.frmData.level,
                    email:$scope.frmData.email,
                    profileurl:$scope.frmData.profileURL
                };
                $scope.orgGen.splice(0, 0, orgData);
                $scope.orgData = getOrgNested($scope.orgGen, 0);
            }
            $scope.frmData = {};
            $scope.isshowTemplate =false;
             $scope.isshoworgchart =true;
            $scope.isshowcreateorg =false;
            $('#myModal').modal('hide');
            
        });
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

    $scope.getArrayIndexForKey =  function(arr, key, val){
        for(var i = 0; i < arr.length; i++){
            if(arr[i][key] === val) {
                return i;
            } 
        }
        return -1;
    };

    $scope.updateRowOrg = function (data) { 
        var index = $scope.getArrayIndexForKey($scope.orgGen, 'org_chart_id_pk', data.org_chart_id_pk); 
        if(index >= 0) {
            $scope.orgGen[index].name = data.name;
            $scope.orgGen[index].designation = data.designation;
            $scope.orgGen[index].email = data.email;
            $scope.orgGen[index].profileurl = data.profileURL;
        }
    };

    $scope.getOrgId = function (arr, parent) {
        for (var i in arr) {
            if (arr[i].parent_id == parent) {
                var children = $scope.getOrgId(arr, arr[i].org_chart_id_pk_tmp);
                $scope.rmId.push(arr[i].org_chart_id_pk);
            }
        }
        return true;
    };


    $('#myModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); // Button that triggered the modal
        var recipient = button.data('whatever'); // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        modal.find('#nodeLevel').val(recipient);
    });

});

function getOrgNested(arr, parent) {
    var out = [];
    for (var i in arr) {
        if (arr[i].parent_id == parent) {
            var children = getOrgNested(arr, arr[i].org_chart_id_pk_tmp);
            if (children.length) {
                arr[i].children = children;
            } else {
                arr[i].children = [];
            }
            out.push(arr[i]);
        }
    }
    return out;
}
/*scroll*/
