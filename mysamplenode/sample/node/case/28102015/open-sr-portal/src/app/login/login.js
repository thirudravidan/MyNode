angular.module( 'srportal.login', [
  'ngRoute'
])
.controller( 'LoginCtrl', function LoginCtrl( $scope,$location,$cookies ) {
	console.log('loginSession_val',$cookies.get('loginSession'));
	$scope.doLogin=function(){
		$cookies.put('loginSession',true);
		$location.path("/home");
	};
});
