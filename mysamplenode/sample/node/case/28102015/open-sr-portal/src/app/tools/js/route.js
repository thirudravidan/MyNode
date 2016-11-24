
apps.config(function($routeProvider) {
    $routeProvider
    .when('/sowsummary', {
        templateUrl: 'tools/view/sowsummary.tpl.ejs',
        controller: 'sowsummaryCtrl'
    })
    .when('/invoice', {
        templateUrl: 'tools/view/invoice.tpl.ejs',
        controller: 'invoiceCtrl'
    })
    .when('/orgchart', {
        templateUrl: 'tools/view/orgchart.tpl.ejs',
        controller: 'orgchartCtrl'
    })
    .when('/meetingMom', {
        templateUrl: 'tools/view/meetingMom.tpl.ejs',
        controller: 'meetingmomCtrl'
    })
    .when('/meetingMom2', {
        templateUrl: 'tools/view/meetingMom2.tpl.ejs',
        controller: 'meetingmomCtrl'
    })
    .when('/momList', {
        templateUrl: 'tools/view/meetingList.tpl.ejs',
        controller: 'meetingmomCtrl'
    })
    .when('/actionItem', {
        templateUrl: 'tools/view/actionItem.tpl.ejs',
        controller: 'meetingmomCtrl'
    })    
    .when('/calendar', {
        templateUrl: 'tools/view/calender.tpl.ejs',
        controller: 'calenderCtrl'
    })
    // route for the 404 page
    .otherwise({
        
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});

