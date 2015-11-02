'use strict';

apps.config(function($routeProvider) {
    $routeProvider
    .when('/home', {
        templateUrl: 'dashboard.ejs',
        // controller: 'userController'
    })
    // route for the 404 page
    .otherwise({
        // controller: '404Controller',
        templateUrl: 'dashboard.ejs'
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});