
apps.config(function($routeProvider) {
    $routeProvider
    .when('/itModule', {
        templateUrl: 'support/view/itModule.tpl.ejs',
        controller: 'itmoduleCtrl'
    })
    .when('/labModule', {
        templateUrl: 'support/view/labModule.tpl.ejs',
        controller: 'labmoduleCtrl'
    })
    .when('/Capex', {
        templateUrl: 'support/view/capex.tpl.ejs',
        controller: 'capexCtrl'
    })
    // route for the 404 page
    .otherwise({
        //controller: '404Controller',filerepository.tpl.ejs
        //templateUrl: 'view/dashboard.ejs'
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});

