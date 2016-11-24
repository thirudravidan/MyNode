
apps.config(function($routeProvider) {
    $routeProvider
    .when('/communicationMatrix', {
        templateUrl: 'project/view/commMatrix.tpl.ejs',
        controller: 'commatrixCtrl'
    })
    .when('/filerepository', {
        templateUrl: 'project/view/filerepository.tpl.ejs',
        controller: 'filerepositoryCtrl'
    })
    .when('/manHours', {
        templateUrl: 'project/view/manHours.tpl.ejs',
        controller: 'manhoursCtrl'
    })
    .when('/itModule', {
        templateUrl: 'project/view/itModule.tpl.ejs',
        controller: 'itmoduleCtrl'
    })
    .when('/labModule', {
        templateUrl: 'project/view/labModule.tpl.ejs',
        controller: 'labmoduleCtrl'
    })
    .when('/projectplan', {
        templateUrl: 'project/view/projectplan.tpl.ejs',
        controller: 'projectplanCtrl'
    })
    .when('/Capex', {
        templateUrl: 'project/view/capex.tpl.ejs',
        controller: 'capexCtrl'
    })
    .when('/projectcalendar', {
        templateUrl: 'project/view/projectcalendar.tpl.ejs',
        controller: 'projectcalendarCtrl'
    })
    // route for the 404 page
    .otherwise({
        //controller: '404Controller',filerepository.tpl.ejs
        //templateUrl: 'view/dashboard.ejs'
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});

