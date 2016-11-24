
apps.controller('newprojectCtrl', function ($rootScope, $scope, $http, $filter, NgTableParams, $routeParams, $location, AjaxMethod, $q,Upload) {	 
	AjaxMethod.getPageLevelACl();
    $scope.data = {};
	$scope.frmData = {}; 
	var data = []; 
	$scope.menuTree = [];
	$scope.rolePer = false;
    $scope.datas = {};
    $scope.frmData.chkTemp = false ;
    $scope.iupdate = false;
    $scope.isInvalidFile =false;
    $scope.frmData.logoURL ='download/projlogo/noimage.jpg';
    if($rootScope.lastClientid!==undefined){
        $scope.frmData.seleClient=$rootScope.lastClientid;
        $( "#showCreate" ).trigger( "click" );
    }
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

    $scope.createNewproject = function(frmData) { 
        var insPath = 'createnewprojectUnit';
        if($scope.frmData.id) { insPath = 'updateProject'; }
        $scope.$broadcast('show-errors-check-validity');
        if ($scope.launchnewproj.$valid) {
           if ($scope.profPic !== undefined && $scope.profPic !=='') {
             Upload.upload({ 
                url: 'caseTracker/master/uploadprologo',
                data: {file: $scope.profPic}
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total, 10);
                    //console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name + '\n');
                }).success(function (data, status, headers, config) {
                    $scope.frmData.logoURL = ($scope.profPic.name !== undefined) ? 'download/projlogo/'+$scope.profPic.name : 'download/projlogo/noimage.jpg';
                    $scope.saveProjectDetails(insPath);
                    $scope.profPic ='';
              });
            }
            else
            {
                $scope.saveProjectDetails(insPath);       
            }
        } else{
            return false;
        } 
        
	};

    $scope.saveProjectDetails =function (insPath){
        $scope.frmData.newprojectstartdate =$("#newprojectstartdate").val();
        $scope.frmData.newprojectgolivedate =$("#newprojectgolivedate").val();
        $scope.frmData.userID = $rootScope.loggedUserDet.user_id_pk;
        AjaxMethod.postMethod('master/'+insPath,$scope.frmData).then( function (data){
            if (!data) {
                successMsg('New Project', 'Project unable to Save the Record');
            } else {
                
                //$('#frmRole').data('bootstrapValidator').resetForm();
                if ($scope.frmData.id) {
                     successMsg('Update Project', 'Project Details Updated successfully');
                     $scope.frmData = {};
                     $scope.Datainit('getprojectUnit');
                     $scope.clearfrm(); 
                 }else{
                    BootstrapDialog.confirm({
                        title: 'Project Creation',
                        message: 'Project created successfully. Do you want to Map Project?',
                        type: BootstrapDialog.TYPE_WARNING, // <-- Default value is BootstrapDialog.TYPE_PRIMARY
                        closable: true, // <-- Default value is false
                        draggable: true, // <-- Default value is false
                        btnCancelLabel: 'Skip', // <-- Default value is 'Cancel',
                        btnOKLabel: 'Yes', // <-- Default value is 'OK',
                        btnOKClass: 'btn-success', // <-- If you didn't specify it, dialog type will be used,
                        callback: function(result) {
                        // result will be true if button was click, while it will be false if users close the dialog directly.
                            if(result) {
                                $rootScope.lastClientid=data.ProjectID;
                                $scope.mapUserProject(data);
                                $scope.$apply();
                            } /*else {
                                $location.path('/Capex');
                                $scope.$apply();
                            }*/
                        }
                    });
                     /*successMsg('New Project', 'Project Created successfully');  
                     $rootScope.CreatedProjectID = data.ProjectID;
                     $scope.Datainit('getprojectUnit');*/
                     $scope.clearfrm();   
                     // $location.path("/projectplan");
                 }
                
            }
        });
    };

    $scope.mapUserProject =function (mapProjDet){
        var param={};
        param.UserID = $rootScope.loggedUserDet.user_id_pk;             
        param.projectID = mapProjDet.ProjectID;
        param.divisionID = mapProjDet.divisionId;
        AjaxMethod.postMethod('user/saveUserProjectMap', param).then(function(data){
            if (data.mapres) {
                $rootScope.redirecttoDashboard({"projID":mapProjDet.ProjectID,"ProjName":mapProjDet.ProjectName,"logo_path":mapProjDet.logoPath,"nxtPath":'calendar',"go_live_date":mapProjDet.go_live_date}); 
                //alert('mapped');
                //$scope.addProjectMapping($rootScope.selectedusrDet);
            }                   
        });
    };

    
    $scope.reset = function() {
        $scope.$broadcast('show-errors-reset');
    };

    $scope.loadClient=function(){
        AjaxMethod.postMethod('project/getClients', {}).then(function(response){  
            if (response !== null) {  
                $scope.ClientDetails=response;
            } 
        });
    };

    $scope.loadLocations=function(){
        AjaxMethod.postMethod('project/getLocations', {}).then(function(response){  
            if (response !== null) {  
                $scope.LocationDetails=response;
            } 
        });
    };

    $scope.loadTimeZones=function(){
        AjaxMethod.postMethod('project/getTimeZoneDet', {}).then(function(response){  
            if (response !== null) {  
                $scope.TimeZoneDetails=response;
            } 
        });
    };

    $scope.loadDevisions=function(){
        AjaxMethod.postMethod('project/getDevisions', {}).then(function(response){  
            if (response !== null) {  
                $scope.DevisionDetails=response;
            } 
        });
    };

    $scope.loadTemplates=function(){
        AjaxMethod.postMethod('project/getTemplates', {}).then(function(response){  
            if (response !== null) {  
                $scope.TemplateDetails=response;
            } 
        });
    };

    $scope.loadBUMas=function(){
        AjaxMethod.postMethod('project/getBUMaster', {}).then(function(response){  
            if (response !== null) {  
                $scope.proBuDetails=response;
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
			$scope.tableProject.reload();
		});
	};
	$scope.tableProject = new NgTableParams({
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
        // $scope.isstartDateenable = $scope.isgoliveDateenable = $scope.istemplateenable =true;    
        $scope.clearfrm();
        $scope.iupdate = true;
        $scope.frmData.id = unitDet.project_id_pk;
        $scope.frmData.newprojectclientname = unitDet.project_name;
        $scope.frmData.newprojectprojectdescription = unitDet.project_desc;
        $scope.frmData.newprojectstartdate = $filter('date')(new Date(unitDet.start_date),'yyyy-MM-dd');
        // $scope.frmData.logo_path = unitDet.logo_path;
        $scope.frmData.newprojectgolivedate = $filter('date')(new Date(unitDet.go_live_date),'yyyy-MM-dd');        
        $scope.frmData.seleClient = unitDet.client_id_fk;
        $scope.frmData.seleDevision = unitDet.division_id_fk;
        $scope.frmData.seleLocation = unitDet.location_id_fk;
        $scope.frmData.prolob = unitDet.lob.toString();
        $scope.frmData.selePrjTimeZ = unitDet.prj_loc_timezone_id;
        $scope.frmData.seleGoliveTimeZ = unitDet.prj_golive_timezone_id;
        $scope.frmData.logoURL =  unitDet.logo; 
        if(unitDet.bu_id_pk !== null) {
            $scope.frmData.businessunit = unitDet.bu_id_pk.split(',');
            $scope.frmData.businessunit.forEach(function (value, key) {
                $scope.frmData.businessunit[key] = parseInt(value, 10);    
            });
        }
        $scope.frmData.status = (unitDet.status === 1)?true:false;
    };

    $scope.clearfrm = function() {
        $scope.reset();
        $scope.iupdate = false;
        $scope.frmData = {};
        $scope.profPic='';
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
            $scope.frmData.id = unitDet.project_id_pk;
            $scope.frmData.newprojectclientname = unitDet.project_name;
            $scope.frmData.newprojectprojectdescription = unitDet.project_desc;
            $scope.frmData.newprojectstartdate = $filter('date')(new Date(unitDet.start_date),'yyyy-MM-dd'); 
            $scope.frmData.logo_path = unitDet.logo_path;
            $scope.frmData.newprojectgolivedate = $filter('date')(new Date(unitDet.go_live_date),'yyyy-MM-dd'); 
            $scope.frmData.seleClient = unitDet.client_id_fk;
            $scope.frmData.seleDevision = unitDet.division_id_fk;
            $scope.frmData.seleLocation = unitDet.location_id_fk;
            $scope.frmData.status = (unitDet.status === 1)?true:false;

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


    $('.dtpicker').datepicker({
         format: 'yyyy-mm-dd'
    });
    
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