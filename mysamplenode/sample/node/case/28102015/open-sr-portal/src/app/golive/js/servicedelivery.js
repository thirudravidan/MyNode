apps.controller('serviceDeliveryCtrl', function ($cookies,$rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location, AjaxMethod, $q,$route) {	 
$rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
$rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
AjaxMethod.getPageLevelACl();
$scope.serviceMetrics =[];
$scope.dateRange=[];

$scope.getProjectLiveDate=function (){
	AjaxMethod.postMethod('dashboard/getGoliveDate',{'projectID':$rootScope.selProjectID}).then(function(response){
		$rootScope.projectGoliveDate=response.go_live_date;
		$scope.generateDate($rootScope.projectGoliveDate);
	});
};

$scope.generateDate= function (golivedt){
	var goLive=moment(new Date(golivedt)).add(1,'days').format('MM-DD-YYYY').split('-');
	var goLiveDate = goLive[0]+'/'+goLive[1]+'/'+goLive[2];
	var gldt = new Date(goLiveDate);

	var currentDate=moment().format('MM-DD-YYYY').split('-');
	var curDate = currentDate[0]+'/'+currentDate[1]+'/'+currentDate[2];
	var curdt = new Date(curDate);
	var dtCnt =1;
	while(gldt <= curdt){	
		if (dtCnt <= 60) {
			$scope.dateRange.push({'date':moment(gldt).format('YYYY-MM-DD') , 'frmtDate' : moment(gldt).format('DD-MMM')});
		}		
		gldt= moment(new Date(gldt)).add(1, 'days');	
		dtCnt++;
	}	
};

$scope.updateMetrics =function (newVal,metricsID,oldVal,idx){
	if(newVal === "" || !newVal) {
		return "required";
	}
	if (newVal !== oldVal) {
		var query="SELECT * FROM ? WHERE metrics_name like '%";
		query=query+newVal+"'";
		var isNameExists = alasql(query,[$scope.serviceMetricsMaster]);
		if (isNameExists.length > 0) {
			return "Metrics " +newVal+" Already Exists";
		}else{
			AjaxMethod.postMethod('servicedelivery/saveMetricsName', {'metricsName':newVal.toUpperCase(),'metricsID' : metricsID,'projectID':$rootScope.selProjectID,'userID' : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
				$scope.serviceMetricsMaster[idx].metrics_name=newVal.toUpperCase();
			});
		}
	}	
};



$scope.getProjectMetricDetails = function (){	
	AjaxMethod.postMethod('servicedelivery/getServiceMetricsMas', {'projectID':$rootScope.selProjectID,'userID' : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
		$scope.serviceMetricsMaster=response;		
		AjaxMethod.postMethod('servicedelivery/getProjectServiceDeleveryDetails', {'projectID':$rootScope.selProjectID}).then(function(response){  
			$rootScope.serviceMetricsDetails=response;		
			$scope.serviceMetricsMaster.forEach(function (val,key){
				$scope.metrics={};
				$scope.metrics.service_delivery_id_pk=val.service_delivery_id_pk;
				$scope.metrics.metrics_name=val.metrics_name;
				$scope.metrics.metrics_threshold=val.metrics_threshold;
				$scope.metrics.metricDet=[];
				var metricsVal = alasql("SELECT * FROM ? WHERE service_delivery_id_fk = ?",[$rootScope.serviceMetricsDetails,val.service_delivery_id_pk]);						
				if (metricsVal.length > 0) {
					$scope.dateRange.forEach(function (dtval,dtidx){
						var isDate =false;
						var dataIndex;
						metricsVal.forEach(function (met,idx){
							var serdt =moment(met.service_date).format('YYYY-MM-DD');
							if (serdt === dtval.date) {
								isDate=true;
								dataIndex=idx;
							}						
						});
						$scope.metval={};
						$scope.metval.service_delivery_trans_id=(isDate) ? metricsVal[dataIndex].service_delivery_trans_id : 0;
						$scope.metval.service_date=(isDate) ? moment(metricsVal[dataIndex].service_date).format('YYYY-MM-DD') : dtval.date ;
						$scope.metval.formattedDate=(isDate) ? moment(metricsVal[dataIndex].service_date).format('DD-MM-YYYY') : moment(dtval.date).format('DD-MM-YYYY');
						$scope.metval.comments=(isDate) ? metricsVal[dataIndex].comments : '';
						$scope.metval.service_evaluation=(isDate) ? metricsVal[dataIndex].service_evaluation : '';
						$scope.metval.service_delivery_id_fk=(isDate) ? metricsVal[dataIndex].service_delivery_id_fk : val.service_delivery_id_pk;
						$scope.metrics.metricDet.push($scope.metval);
					});
				}else{
					$scope.dateRange.forEach(function (dtval,dtidx){					
						$scope.metval={};
						$scope.metval.service_delivery_trans_id= 0;
						$scope.metval.service_date= dtval.date ;
						$scope.metval.formattedDate= moment(dtval.date).format('DD-MM-YYYY');
						$scope.metval.comments= '';
						$scope.metval.service_evaluation= '';
						$scope.metval.service_delivery_id_fk= val.service_delivery_id_pk;
						$scope.metrics.metricDet.push($scope.metval);
					});
				}
				$scope.serviceMetrics.push($scope.metrics);
			});	
		});
	});	
};

 $scope.checkValid = function(data, field) {
    if(data === "" || !data) {
        return "required";
    }
 };

$scope.saveMetrics =function (metVal,transID,serDate,metrmasID){
	angular.forEach(metVal, function(val, key) {
		if (val !== '') {
			var metDet =key.split('_');
			var param={};
			param.metricmasID=metrmasID;
			param.transID = (metDet[2] === 'n') ? 0 : metDet[2];
			param.ser_date = metDet[1];
			param.service_evaluation = val;
			param.comment = '';
			param.userID =$rootScope.loggedUserDet.user_id_pk;
			param.projectID =$rootScope.selProjectID;
			AjaxMethod.postMethod('servicedelivery/saveMetricsDetails', param).then(function(response){
				if (response.servStatus) {
					// $route.reload();
				}
			});
		}
	});
	$route.reload();
	/*var param={};
	param.metricmasID=metrmasID;
	param.transID =transID;
	param.ser_date = serDate;
	param.service_evaluation =metVal.serviceEvaluation;
	param.comment =metVal.comments;
	param.userID =$rootScope.loggedUserDet.user_id_pk;
	param.projectID =$rootScope.selProjectID;
	AjaxMethod.postMethod('servicedelivery/saveMetricsDetails', param).then(function(response){
		if (response.servStatus) {
			$route.reload();
		}
	});*/
};

$scope.removeMetrics =function (metMasID,metName){	
	BootstrapDialog.confirm({
			title: 'Service Delivery',
            message: "Do you want to remove "+metName+" metrics ?", 
            callback: function(result){
				if(result) {
					AjaxMethod.postMethod('servicedelivery/removeMetrics', {'metMasID' : metMasID}).then(function(response){
						if (response.servStatus) {
							$route.reload();
						}
					});
				}
			}
	});
};

$scope.saveNewMetrics =function (data){
	if(data !== "" || data) {
		var query="SELECT * FROM ? WHERE metrics_name like '%";
		query=query+data+"'";
		var isNameExists = alasql(query,[$scope.serviceMetricsMaster]);
		if (isNameExists.length > 0) {
			return "Metrics " +data+" Already Exists";
		}else{
			AjaxMethod.postMethod('servicedelivery/saveMetricsName', {'metricsName':data.toUpperCase(),'metricsID' : 0,'projectID':$rootScope.selProjectID,'userID' : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
				if (response.servStatus) {
					$route.reload();
				}
			});
		}
	}
	
};

$scope.updateThreshold =function (newVal,metricsID,oldVal,idx){
	if(newVal === "" || !newVal) {
		return "required";
	}else{
		AjaxMethod.postMethod('servicedelivery/updateThresholdValue', {'newThreshold':newVal,'metricsID' : metricsID,'projectID':$rootScope.selProjectID,'userID' : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
			if (response.servStatus) {
				$scope.serviceMetricsMaster[idx].metrics_threshold=newVal;
			}
		});
	}
};

/*$scope.getServiceMetrics=function (){
	AjaxMethod.postMethod('servicedelivery/getServiceMetricsMas', {'projectID' : $rootScope.selProjectID,'userID' : $rootScope.loggedUserDet.user_id_pk}).then(function(response){
		$scope.serviceMetricsMaster=response;
	});
};*/
}).controller('ServicePanelController', function($rootScope,$scope){
    this.tab = 0;
    this.selectTab = function(setTab) { // changing the content based on what tab is clicked.  
        this.tab = setTab;
    };
    this.isSelected = function(checkTab) { // adding the removing the active tab for the tab triggers to change the look of them.
        return this.tab === checkTab;
    };
});
/*fixed header*/

