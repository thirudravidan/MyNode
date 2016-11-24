//Defining Common Route 

apps.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.
    // when('/login',{
    //     templateUrl: 'login/login.tpl.ejs',
    //     controller: 'LoginCtrl',
    //     data:{ pageTitle: 'Login' }
    //   }).
      when('/dashboard', {
        templateUrl: 'master/view/dashboard.tpl.ejs',
        controller: 'dashboardCtrl',
        data:{ pageTitle: 'Dashboard' }
      }).
      otherwise({
        templateUrl: 'master/view/dashboard.tpl.ejs',
        controller: 'dashboardCtrl',
        data:{ pageTitle: 'Dashboard' }
      });
}]);