
apps.config(function($routeProvider) {
    $routeProvider
    .when('/categoryCreate', {
        templateUrl: 'admin/view/categoryCreate.ejs',
        controller: 'adminCtrl'
    })
    .when('/dashboard', {
        templateUrl: 'master/view/dashboard.tpl.ejs',
        controller: 'dashboardCtrl'
    })    
    .when('/deliveryUnit', {
        templateUrl: 'master/view/deliveryUnit.tpl.ejs',
        controller: 'masterCtrl'
    })
    .when('/client', {
        templateUrl: 'master/view/client.tpl.ejs',
        controller: 'clientCtrl'
    })
    .when('/meetingMom', {
        templateUrl: 'tools/view/meetingMom.tpl.ejs',
        controller: 'meetingMomCtrl'
    })
    .when('/manhrscalc', {
        templateUrl: 'tools/view/manhrscalc.tpl.ejs',
        controller: 'manhrscalcCtrl'
    })
    .when('/sowsummary', {
        templateUrl: 'tools/view/sowsummary.tpl.ejs',
        controller: 'sowsummaryCtrl'
    })
    .when('/location', {
        templateUrl: 'master/view/location.tpl.ejs',
        controller: 'locationCtrl'
    })
     .when('/client', {
        templateUrl: 'master/view/client.tpl.ejs',
        controller: 'clientCtrl'
    })
      .when('/newproject', {
        templateUrl: 'master/view/newproject.tpl.ejs',
        controller: 'newprojectCtrl'
    }) 
    .when('/userCreate', {
        templateUrl: 'master/view/userCreate.tpl.ejs',
        controller: 'userCtrl'
    })
    .when('/mailTemplate', {
        templateUrl: 'master/view/mailtemplate.tpl.ejs',
        controller: 'mailtemplateCtrl'
    })
    // route for the 404 page
    .otherwise({
        
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});

