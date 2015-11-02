'use strict';
apps.config(function($routeProvider) {
    $routeProvider
    .when('/calendarevent', {
        templateUrl: 'calendar/view/calendarevent.ejs',
        // controller: 'userCtrl'
    })
    .when('/calendareventlist', {
        templateUrl: 'calendar/view/calendareventlist.ejs',
        // controller: 'userCtrl'
    })
    .when('/calendar', {
        templateUrl: 'calendar/view/calendar.ejs',
        // controller: 'userController'
    })
    .when('/calendarsettings', {
        templateUrl: 'calendar/view/calendarsettings.ejs',
        // controller: 'userController'
    })
    .when('/calendarsettingslist', {
        templateUrl: 'calendar/view/calendarsettingslist.ejs',
        // controller: 'userController'
    });
    // configure ejsl5 to get links working on jsfiddle
    //$locationProvider.ejsl5Mode(true);
});