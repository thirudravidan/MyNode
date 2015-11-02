'use strict';
apps.config(function($routeProvider) {
    $routeProvider
    .when('/reports/callbackList', {
        templateUrl: 'reports/view/callbackList.ejs',
        controller: 'callbackcaseController'
    })
    .when('/reports/agingList', {
        templateUrl: 'reports/view/agingList.ejs',
        controller: 'agingcaseController'
    });
     
    // route for the 404 page
    /*.otherwise({
        templateUrl: 'formbuilder/view/index.ejs',
        controller: 'FromBuilderController'
    });*/
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});