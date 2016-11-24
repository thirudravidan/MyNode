
apps.config(function($routeProvider) {
    $routeProvider
    .when('/reportAssessment', {
        templateUrl: 'reports/view/assessment.tpl.ejs',
        controller: 'rptassessmentCtrl'
    })
    .when('/reportAttandance', {
        templateUrl: 'reports/view/attandance.tpl.ejs',
        controller: 'rptassessmentCtrl'
    })  
    // route for the 404 page
    .otherwise({
        //controller: '404Controller',filerepository.tpl.ejs
        //templateUrl: 'view/dashboard.ejs'
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});

