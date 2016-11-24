
apps.config(function($routeProvider) {
    $routeProvider
    .when('/servicedelivery', {
        templateUrl: 'golive/view/servicedelivery.tpl.ejs',
        controller: 'serviceDeliveryCtrl'
    })  
    .when('/golive', {
        templateUrl: 'golive/view/golive.tpl.ejs',
        controller: 'goliveCtrl'
    })  
    // route for the 404 page
    .otherwise({
        //controller: '404Controller',filerepository.tpl.ejs
        //templateUrl: 'view/dashboard.ejs'
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});

