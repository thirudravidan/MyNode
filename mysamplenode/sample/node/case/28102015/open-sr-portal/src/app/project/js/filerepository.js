
apps.controller('filerepositoryCtrl', function ($cookies,$rootScope, $scope, $http, $filter, ngTableParams, $routeParams, $location, AjaxMethod, $q) {	 
var controllerName='filerepository';
$rootScope.selProjectID = ($cookies.get('selectedProjectID') === undefined) ? $rootScope.selProjectID : $cookies.get('selectedProjectID');
$rootScope.selProjectName = ($cookies.get('selectedProjectName') === undefined) ? $rootScope.selProjectName : $cookies.get('selectedProjectName');
$scope.HostingURL=golobalconfigs.downloadURL;
$scope.SelectedNode=0;

$scope.gridlistView = function(type) {
	 
    if(type === 'grid') {
		$('#products .item').removeClass('list-group-item');
		$('#products .item').addClass('grid-group-item');
    } else {
		$('#products .item').addClass('list-group-item');
    }
	
}; 

$scope.$watch( 'abc.currentNode', function( newObj, oldObj ) {
	$scope.searchkey='';
    if( $scope.abc && angular.isObject($scope.abc.currentNode) ) {
        $scope.SelectedNode = $scope.abc.currentNode.TaskID;
         var treeID = alasql("SELECT treeID FROM ? WHERE TaskID = ?",[$rootScope.allTasks,$scope.SelectedNode])[0].treeID;
		if (treeID > 1 ) {
			$scope.getAttachmentById($scope.abc.currentNode.TaskID);
		}else{
			$scope.attachmentDetails =$rootScope.allAttach;
		}
    }
}, false);

$scope.getTaskDetails=function(){
	AjaxMethod.postMethod(controllerName+'/getAllTask', {'projectID':$rootScope.selProjectID}).then(function(response){
		$rootScope.allTasks = $scope.ProjectTaskDetails=response;
		$scope.treedata = getNestedChildren($scope.ProjectTaskDetails, 0);
	});
	$scope.getAttachmentDetails();
};

$scope.getAttachmentDetails=function(){
	AjaxMethod.postMethod(controllerName+'/getAttachmentDetails', {'projectID':$rootScope.selProjectID}).then(function(response){
		$rootScope.allAttach=$scope.attachmentDetails=response;
	});
	 
};

$scope.getAttachmentById=function(taskId){
	$scope.attachmentDetails = alasql("SELECT * FROM ? WHERE TaskID = ?",[$rootScope.allAttach,taskId]);
};

$scope.searchAttachments=function(fileName){
	var alsqlQuery="SELECT * FROM ? WHERE FileName like '%";
	alsqlQuery=alsqlQuery+fileName+"%'";
	alsqlQuery=alsqlQuery+" or UploadedBy like '%";
	alsqlQuery=alsqlQuery+fileName+"%'";	
	$scope.attachmentDetails = alasql(alsqlQuery,[$rootScope.allAttach]);
};

$scope.doSearch=function(){
	$scope.searchAttachments($scope.searchkey);
};

});

function getNestedChildren(arr, parent) {
    var out = [];
    for (var i in arr) {
		if (arr[i].rootID == parent) 
		{
			var children = getNestedChildren(arr, arr[i].treeID);
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