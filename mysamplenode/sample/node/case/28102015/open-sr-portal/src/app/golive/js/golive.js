apps.controller('goliveCtrl', function ($cookies,$rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location, AjaxMethod, $q,$route) {	 
	$rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
	$rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
	AjaxMethod.getPageLevelACl();
	$scope.goliveData =[];
	$scope.statuses = [
		{value: 1, text: 'Pass'},
		{value: 2, text: 'Fail'}
	]; 
	$scope.resolveHrs = [
		{value: 1, text: '< 24 Hrs'},
		{value: 2, text: '> 24 Hrs'}
	]; 
	$scope.isEmailSend =0;

	$scope.addNewModule =function (){
		var milliseconds = new Date().getTime();
		$scope.inserted = {
			golive_mod_id_pk: 'n'+milliseconds,      
			golive_mod_name: '',
			golive_mod_desc: ''	,
			golive_mod_status : 0,
			fail_resolve_hrs : 0	
		};
		$scope.goliveData.push($scope.inserted);
	};

	$scope.getArrayIndexForKey =  function(arr, key, val){
		for(var i = 0; i < arr.length; i++){
			if(arr[i][key] === val) {
				return i;
			}
		}
		return -1;
	};

	$scope.cancelNewRow = function(id,idx){
		if(id[0] === 'n') {
			$scope.delModule(id);
		} else{
			if ($scope.oldStatus !== undefined) {
				$scope.goliveData[idx].golive_mod_status = $scope.oldStatus ;	
				$scope.oldStatus = undefined;
			}			
		}
    };

	$scope.delModule = function(id) { 
        var index = $scope.getArrayIndexForKey($scope.goliveData, 'golive_mod_id_pk', id);
        if(index >= 0) {
            $scope.goliveData.splice(index, 1);
        }
    };

	$scope.checkValid =function (data){
		if(data === "" || !data) {
			return "required";
		}
	};
	$scope.saveGoliveModule =function (data,modid){
		var param={};
		param.projectID = $rootScope.selProjectID;
		param.userID = $rootScope.loggedUserDet.user_id_pk;
		param.module_id = (modid[0] === 'n') ? 0 : modid;
		param.module_Name = data.golive_mod_name;
		param.module_desc = data.golive_mod_desc;
		param.module_status =(modid[0] === 'n') ? 0 : data.golive_mod_status;
		param.fail_resolve_status =(modid[0] === 'n') ? 0 : data.fail_resolve_hrs;
		AjaxMethod.postMethod('golive/saveGoliveModule', param).then(function(response){
			if (response.modStatus) {
				$scope.oldStatus = undefined;
				$scope.getGoliveMasterData();
			}			
		});

	};

	$scope.showAttVal = function(val) {
        var selected = [];
        if($scope.statuses.length && val !== undefined) {
            selected = $filter('filter')($scope.statuses, {'option_id_pk': val});
            return (selected.length && val !== '') ? selected[0]['option_name'] : 'None';
        } else {
            return 'None';
        }
    };

    $scope.getGoliveMasterData = function (){
		AjaxMethod.postMethod('golive/getGoliveMaster', {'projectID':$rootScope.selProjectID}).then(function(response){
			if (response.length > 0) {
				$scope.isEmailSend =response[0].email_status;
				$scope.goliveMasID =response[0].golive_id_pk;
				if (response[0].hasOwnProperty('GMT')) {
					$scope.goliveData = response[0].GMT;
				}
			}
		});

    };

	$scope.removeModule = function(modID) {
		BootstrapDialog.confirm('Are you sure to delete?', function(result){
			if(result) {			
			AjaxMethod.postMethod('golive/deleteGolivemod', {'modID':modID}).then(function(response){
				if(response.affectedRows > 0) {
					$scope.delModule(modID);
				}
			});
			}
		});
	};

	$scope.onStatusChanged= function (dat,idx,oldStat){		
		$scope.oldStatus = oldStat;
		$scope.goliveData[idx].golive_mod_status = dat;
	};

	$scope.loadUser = function(query) {
        return AjaxMethod.postMethod('golive/getTokenUser',{'query':query,'projectID' : $rootScope.selProjectID});
    };

	$scope.sendMailToUser =function (){
		if ($scope.goliveData.length > 0) {
			if ($scope.tags !== undefined) {
				var param={};
				param.projectID = $rootScope.selProjectID;
				param.projectName = $rootScope.selProjectName;
				param.masID = $scope.goliveMasID;
				param.mailUser = $scope.tags;
				param.userID = $rootScope.loggedUserDet.user_id_pk;				
				AjaxMethod.postMethod('golive/mailToUser', param).then(function(response){
					if(response.goliveStatus){
						successMsg('Golive', 'Mail successfully sent to the Receipients .');
						$scope.getGoliveMasterData();
					}
				});
			}else{
				alert('Choose Atleast one Mail Receipent .');	
			}
		}else{
			alert('Add atleast one test module .');
		}	
	};
});